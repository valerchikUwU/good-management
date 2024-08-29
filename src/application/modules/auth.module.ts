import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controllers/auth.controller';
import { UsersModule } from './users.module';
import { GeneratorModule } from './generator.module';

@Module({
    imports: [GeneratorModule, HttpModule,
        ConfigModule,
        UsersModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => config.get("jwt"),
            inject: [ConfigService],
        }),],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }

