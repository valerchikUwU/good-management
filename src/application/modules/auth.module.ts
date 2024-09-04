import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { AuthController } from 'src/controllers/auth.controller';
import { UsersModule } from './users.module';
import { GeneratorModule } from './generator.module';
import { RefreshModule } from './refresh.module';
import { AccessJwtStrategy } from 'src/config/access-jwt-strategy';
import { RefreshJwtStrategy } from 'src/config/refresh-jwt-strategy';

@Module({
  imports: [
    RefreshModule,
    GeneratorModule,
    HttpModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({}),
  ],
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
