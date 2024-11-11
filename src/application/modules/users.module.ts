import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../controllers/users.controller';
import { UsersService } from '../services/users/users.service';
import { User } from 'src/domains/user.entity';
import { UsersRepository } from '../services/users/Repository/users.repository';
import { RoleSettingModule } from './roleSetting.module';
import { RoleModule } from './role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleSettingModule, RoleModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
