import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './application/modules/users.module';
import {ConfigModule, ConfigService} from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/database';
import { AuthModule } from './application/modules/auth.module';
import * as path from 'path';



@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '*.{ts,js}')), 
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => (configService.get('database'))
  }),
  UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
