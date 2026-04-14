import 'reflect-metadata';
import { createHash } from 'node:crypto';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
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

async function setupAdminPanel(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  /* AdminJS @adminjs/typeorm опирается на Active Record (`getRepository` на классе сущности). */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- BaseEntity.useDataSource из typeorm
  Supplier.useDataSource(dataSource);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Category.useDataSource(dataSource);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: (email: string, password: string) =>
        email === adminEmail && password === adminPassword ? { email } : null,
      cookieName: 'electrotech_admin',
      cookiePassword: sessionSecret,
    },
    null,
    {
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    },
  );

  app.use('/admin', router);
}

async function bootstrap(): Promise<void> {
  const bootstrapLogger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

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
  await app.listen(port);
  bootstrapLogger.log(`API listening on http://0.0.0.0:${port}`);

  // После listen: healthcheck видит /health даже если AdminJS не поднялся (логируем причину).
  try {
    await setupAdminPanel(app);
    bootstrapLogger.log(`AdminJS panel: http://0.0.0.0:${port}/admin`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    bootstrapLogger.error(`AdminJS failed to initialize; API continues without /admin: ${message}`, stack);
  }
}

void bootstrap();
