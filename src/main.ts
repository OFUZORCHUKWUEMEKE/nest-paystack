import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsLoggerFilter } from './common/exceptions/bases';
import { HttpExceptionFilter } from './common/exceptions/exception';
import { ModelExceptionFilter } from './common/filters/exceptions/model-exception.filter';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import config from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api");
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))

  app.useGlobalFilters(new HttpExceptionFilter(), new ModelExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Nestjs Paystack Integration')
    .setDescription('Paystack Integration with nestjs with a wallet feature')
    .setVersion('1.0')
    .addTag('NEST PAYSTACK API')   
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);


}
bootstrap();
