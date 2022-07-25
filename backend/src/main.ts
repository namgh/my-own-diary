import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  let httpsOptions: HttpsOptions;

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useGlobalFilters(new HttpExceptionFilter());
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
