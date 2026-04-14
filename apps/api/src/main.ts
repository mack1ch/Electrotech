import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { Category } from './catalog/entities/category.entity';
import { Product } from './catalog/entities/product.entity';
import { Supplier } from './catalog/entities/supplier.entity';

async function setupAdminPanel(app: INestApplication): Promise<void> {
  const adminJsModuleName = 'adminjs';
  const adminJsTypeormModuleName = '@adminjs/typeorm';
  const adminJsExpressModuleName = '@adminjs/express';
  const [{ default: AdminJS }, { Database, Resource }, AdminJSExpress] = await Promise.all([
    import(adminJsModuleName),
    import(adminJsTypeormModuleName),
    import(adminJsExpressModuleName),
  ]);

  // Adapter packages export loose types, runtime API is stable.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  AdminJS.registerAdapter({ Database, Resource });

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@local.dev';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? 'replace-me-with-admin-session-secret';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const admin = new AdminJS({
    rootPath: '/admin',
    resources: [Supplier, Category, Product],
    branding: {
      companyName: 'Electrotech API Admin',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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

  await setupAdminPanel(app);

  const port = process.env.API_PORT ?? '4000';
  await app.listen(port);
  bootstrapLogger.log(`API listening on http://0.0.0.0:${port}`);
  bootstrapLogger.log(`AdminJS panel: http://0.0.0.0:${port}/admin`);
}

void bootstrap();
