import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
}

void bootstrap();
