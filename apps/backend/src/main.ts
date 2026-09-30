/**
 * Polyfill TC39 ECMAScript Temporal API.
 * 
 * Required by Prisma's PostgreSQL driver adapter (pg/timestamptz-temporal@1 codec).
 * Without this, queries returning PostgreSQL `timestamptz` / `DateTime` columns fail to
 * decode the response in Node runtimes lacking native global Temporal support. (very important)
 */
import { Temporal } from '@js-temporal/polyfill';
if (!(globalThis as any).Temporal) {
  (globalThis as any).Temporal = Temporal;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
