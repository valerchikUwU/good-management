import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './utils/winston-logger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './utils/validationExceptionFilter';
dotenv.config();



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig), // используем конфигурацию
  });  
  
  // Получаем экземпляр логгера NestWinston
  const logger = app.get('NestWinston'); 
  
  // Подключаем глобальный фильтр для валидации
  app.useGlobalFilters(new ValidationExceptionFilter(logger));


  // Внутри функции bootstrap
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Удаляет поля, которые отсутствуют в DTO
    forbidNonWhitelisted: true, // Отклоняет запросы с "лишними" полями
    transform: true,   // Преобразует входные данные в типы, указанные в DTO
    forbidUnknownValues: true,  // Предотвращает неизвестные значения
    exceptionFactory: (errors) => new BadRequestException(errors), 
  }));
  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    // true for all origins
    origin: true,
  });

  const swaggerApi = new DocumentBuilder()
    .setTitle('Good-Management API')
    .setDescription('The GM API description')
    .setVersion('1.0')
    .build()
  const port = process.env.PORT || 5000;
  const host = process.env.API_HOST;
  const document = SwaggerModule.createDocument(app, swaggerApi);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV === 'prod') {
    app.setGlobalPrefix('gm'); // Устанавливаем префикс для всех маршрутов
  }

  await app.listen(port, () => console.log(`${host}${port}/`));
}
bootstrap();
