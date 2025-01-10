import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './utils/winston-logger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './utils/validationExceptionFilter';
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  //   {
  //     logger: WinstonModule.createLogger(winstonConfig),
  //   }
  // );
  const logger = app.get('NestWinston');

  app.useGlobalFilters(new ValidationExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.use(cookieParser());
  app.enableCors({ 
    origin: process.env.NODE_ENV === 'dev' ? true : false,
    credentials: true,
  });

  if (process.env.NODE_ENV === 'prod') {
    app.setGlobalPrefix('gm');
  }

  const swaggerApi = new DocumentBuilder()
    .setTitle('Good-Management API')
    .setDescription(
      'The GM API description.\n\n[Export JSON](http://localhost:5000/swagger-json)',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Указывает формат токена (опционально)
      },
      'access-token', // Название схемы (используется в декораторе @ApiBearerAuth)
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerApi);

  if (process.env.NODE_ENV === 'prod') {
    SwaggerModule.setup('gm/api', app, document);
  } else {
    SwaggerModule.setup('api', app, document);
  }

  // Добавляем маршрут для экспорта документации в формате JSON
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document); // Возвращаем JSON-документ
  });

  const port = process.env.PORT || 5000;
  const host = process.env.NODE_ENV === 'dev' ? process.env.API_HOST : process.env.PROD_API_HOST;

  await app.listen(port, () => console.log(`${host}/`));
}

bootstrap();
