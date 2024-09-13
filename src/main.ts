import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const swaggerApi = new DocumentBuilder()
    .setTitle('Good-Management API')
    .setDescription('The GM API description')
    .setVersion('1.0')
    .build()
  const port = process.env.PORT || 5000;
  const host = process.env.API_HOST;
  const document = SwaggerModule.createDocument(app, swaggerApi);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => console.log(`${host}${port}/`));
}
bootstrap();
