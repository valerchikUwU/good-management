import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;
  app.use(cookieParser());
  console.log(process.env.JWT_ACCESS_SECRET);
  
  console.log(process.env.JWT_REFRESH_SECRET);
  await app.listen(port, () => console.log(`http://localhost:${port}/`));
}
bootstrap();
