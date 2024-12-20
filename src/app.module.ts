import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './application/modules/users.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './application/modules/auth.module';
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
import { PostModule } from './application/modules/post.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './utils/winston-logger';
import { StatisticModule } from './application/modules/statistic.module';
import { FileUploadModule } from './application/modules/file-upload.module';
import { FileModule } from './application/modules/file.module';
import { RoleSettingModule } from './application/modules/roleSetting.module';
import { RoleModule } from './application/modules/role.module';
import { QueueModule } from './application/modules/queue.module';
import { PolicyToPolicyDirectoryModule } from './application/modules/policyToPolicyDirectory.module';
import { PolicyDirectoryModule } from './application/modules/policyDirectory.module';
import { ConvertModule } from './application/modules/convert.module';
import { ConvertToUserModule } from './application/modules/convertToUser.module';
import { MessageModule } from './application/modules/message.module';
import { GroupModule } from './application/modules/group.module';
import { GroupToUserModule } from './application/modules/groupToUser.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}'),
    ),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    ...(process.env.NODE_ENV === 'prod'
      ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: '/gm/uploads',
        })
      ] : [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: 'uploads',
        })
      ]),
    ...(process.env.NODE_ENV === 'prod'
      ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '../../../gm_front_build/GM'),
          serveRoot: '/gm/mobile', // Фронтенд будет доступен по корню
        }),
      ]
      : []),
    ...(process.env.NODE_ENV === 'prod'
      ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '../../../gm_front_build/GMDesktop'),
          serveRoot: '/gm/desktop', // Фронтенд будет доступен по корню
        }),
      ]
      : []),
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    AuthModule,
    EventsModule,
    TelegramModule,
    OrganizationModule,
    AccountModule,
    PolicyModule,
    GoalModule,
    ObjectiveModule,
    ProjectModule,
    StrategyModule,
    TargetModule,
    TargetHolderModule,
    PostModule,
    StatisticModule,
    FileUploadModule,
    FileModule,
    RoleSettingModule,
    RoleModule,
    QueueModule,
    PolicyToPolicyDirectoryModule,
    PolicyDirectoryModule,
    ConvertModule,
    ConvertToUserModule,
    MessageModule,
    GroupModule,
    GroupToUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
