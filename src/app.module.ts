import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './application/modules/users.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { ConfigModule as Conf } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/database';
import { AuthModule } from './application/modules/auth.module';
import { EventsGateway } from './gateways/events.gateway';
import * as path from 'path';
import { EventsModule } from './application/modules/events.module';
import { TelegramModule } from './application/modules/telegram.module';
import { OrganizationModule } from './application/modules/organization.module';
import { AccountModule } from './application/modules/account.module';
import { PolicyModule } from './application/modules/policy.module';
import { GoalModule } from './application/modules/goal.module';
import { ObjectiveModule } from './application/modules/objective.module';
import { StrategyModule } from './application/modules/strategy.module';
import { ProjectModule } from './application/modules/project.module';
import { TargetModule } from './application/modules/target.module';
import { TargetHolderModule } from './application/modules/targetHolder.module';



@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('database'))
    }),
    UsersModule, AuthModule, EventsModule, TelegramModule, OrganizationModule, AccountModule,
    PolicyModule, GoalModule, ObjectiveModule, ProjectModule, StrategyModule, TargetModule, TargetHolderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
