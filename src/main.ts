import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsLoggerFilter } from './common/exceptions/bases';
import { HttpExceptionFilter } from './common/exceptions/exception';
import { ModelExceptionFilter } from './common/filters/exceptions/model-exception.filter';
import * as cookieParser from 'cookie-parser';
// import config from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);

  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.use(cookieParser())

  app.useGlobalFilters(new HttpExceptionFilter(), new ModelExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))
}
bootstrap();
