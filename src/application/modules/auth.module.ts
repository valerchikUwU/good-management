import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controllers/auth.controller';
import { UsersModule } from './users.module';
import { GeneratorModule } from './generator.module';
import { RefreshModule } from './refresh.module';
import { AccessJwtStrategy } from 'src/config/access-jwt-strategy';
import { RefreshTokenStrategy } from 'src/config/refresh-jwt-strategy';
import { EventsModule } from './events.module';

@Module({
  imports: [
    RefreshModule,
    GeneratorModule,
    HttpModule,
    ConfigModule,
    UsersModule,
    EventsModule,
    PassportModule.register({}),
    JwtModule.register({}),
  ],
  providers: [AuthService, AccessJwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [PassportModule, AccessJwtStrategy, RefreshTokenStrategy]
})
export class AuthModule { }
