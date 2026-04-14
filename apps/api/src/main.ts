import 'reflect-metadata';
import { createHash } from 'node:crypto';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import type { SessionOptions } from 'express-session';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Category } from './catalog/entities/category.entity';
import { Product } from './catalog/entities/product.entity';
import { Supplier } from './catalog/entities/supplier.entity';

/** AdminJS / cookie encryption ожидают достаточно длинный секрет; короткие значения из .env не должны валить API. */
function adminSessionSecret(raw: string): string {
  if (raw.length >= 32) {
    return raw;
  }
  return createHash('sha256').update(raw, 'utf8').digest('hex');
}

/** ESM-only пакеты AdminJS: при `module: commonjs` `import('pkg')` превращается в `require('pkg')` и падает на `exports`. */
function esmDynamicImport(specifier: string): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call -- runtime `import()` при emit CJS (не `require` к ESM-only пакетам)
  return new Function('specifier', 'return import(specifier)')(specifier) as Promise<unknown>;
}

/** Публичный origin API (как в браузере), без завершающего `/`. Для логов и эвристики HTTPS за nginx. */
function publicApiOrigin(): string | undefined {
  const raw =
    process.env.PUBLIC_API_URL?.trim() ||
    process.env.API_PUBLIC_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    return undefined;
  }
  try {
    const u = new URL(raw);
    return `${u.protocol}//${u.host}`;
  } catch {
    return undefined;
  }
}

/**
 * За reverse proxy (nginx) нужны `trust proxy` и `express-session` с `proxy: true`,
 * иначе `Set-Cookie` без `Secure` на HTTPS и редиректы с неверным протоколом — админка «не логинится».
 */
function trustProxyEnabled(): boolean {
  const v = process.env.TRUST_PROXY?.trim().toLowerCase();
  if (v === 'true' || v === '1') {
    return true;
  }
  if (v === 'false' || v === '0') {
    return false;
  }
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  return publicApiOrigin()?.startsWith('https:') ?? false;
}

async function setupAdminPanel(app: NestExpressApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  /* AdminJS @adminjs/typeorm опирается на Active Record (`getRepository` на классе сущности). */
  Supplier.useDataSource(dataSource);
  Category.useDataSource(dataSource);
  Product.useDataSource(dataSource);

  const [adminJsMod, typeormMod, expressMod] = await Promise.all([
    esmDynamicImport('adminjs'),
    esmDynamicImport('@adminjs/typeorm'),
    esmDynamicImport('@adminjs/express'),
  ]);
  type AdminJsCtor = {
    registerAdapter: (a: { Database: unknown; Resource: unknown }) => void;
    new (options: unknown): unknown;
  };
  const AdminJS = (adminJsMod as { default: AdminJsCtor }).default;
  const { Database, Resource } = typeormMod as { Database: unknown; Resource: unknown };
  const AdminJSExpress = expressMod as { buildAuthenticatedRouter: (...args: unknown[]) => unknown };

  AdminJS.registerAdapter({ Database, Resource });

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@local.dev';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const sessionSecret = adminSessionSecret(
    process.env.ADMIN_SESSION_SECRET ?? 'replace-me-with-admin-session-secret',
  );

  const admin = new AdminJS({
    rootPath: '/admin',
    resources: [Supplier, Category, Product],
    branding: {
      companyName: 'Electrotech API Admin',
    },
  });

  const trustProxy = trustProxyEnabled();
  const sessionOptions: SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: trustProxy,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // за nginx + HTTPS: `proxy: true` + `X-Forwarded-Proto` → secure-cookie; на чистом HTTP без заголовка остаётся не-Secure
      secure: 'auto',
    },
  };

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: (email: string, password: string) =>
        email === adminEmail && password === adminPassword ? { email } : null,
      cookieName: 'electrotech_admin',
      cookiePassword: sessionSecret,
    },
    null,
    sessionOptions,
  );

  /**
   * После `app.use('/admin', router)` запрос `GET /admin` (без `/` в конце) часто приходит с `req.url === ''` или `?…`,
   * а AdminJS регистрирует индекс как `router.get('')` — без нормализации запрос не попадает в панель и уходит в 404 Nest.
   */
  function normalizeAdminMountedUrl(req: Request, _res: Response, next: NextFunction): void {
    if (!req.url || req.url.startsWith('?')) {
      req.url = `/${req.url}`;
    }
    next();
  }

  // Важно вызывать до `listen()`: иначе middleware окажется после финального 404 Nest — `GET /admin` не дойдёт до AdminJS.
  app.use('/admin', normalizeAdminMountedUrl, router as Parameters<NestExpressApplication['use']>[1]);
}

async function bootstrap(): Promise<void> {
  const bootstrapLogger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  if (trustProxyEnabled()) {
    app.set('trust proxy', 1);
  }

  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: false,
    }),
  );

  const webOrigins = process.env.WEB_ORIGINS;
  app.enableCors({
    origin: webOrigins ? webOrigins.split(',').map((s) => s.trim()) : true,
  });

  const port = process.env.API_PORT ?? '4000';

  try {
    await setupAdminPanel(app);
    const publicOrigin = publicApiOrigin();
    bootstrapLogger.log(
      publicOrigin
        ? `AdminJS panel: ${publicOrigin}/admin`
        : `AdminJS panel: http://0.0.0.0:${port}/admin (задайте PUBLIC_API_URL или NEXT_PUBLIC_API_URL для публичного URL в логах)`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    bootstrapLogger.error(`AdminJS failed to initialize; API continues without /admin: ${message}`, stack);
  }

  await app.listen(port);
  bootstrapLogger.log(`API listening on http://0.0.0.0:${port}`);
}

void bootstrap();
