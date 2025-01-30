import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../controllers/users.controller';
import { UsersService } from '../services/users/users.service';
import { User } from 'src/domains/user.entity';
import { UsersRepository } from '../services/users/Repository/users.repository';
import { RoleSettingModule } from './roleSetting.module';
import { RoleModule } from './role.module';
import { OrganizationModule } from './organization.module';
import { PostModule } from './post.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleSettingModule, RoleModule, OrganizationModule, PostModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
