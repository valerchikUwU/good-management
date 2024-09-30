import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../controllers/users.controller';
import { UsersService } from '../services/users/users.service';
import { User } from 'src/domains/user.entity';
import { UsersRepository } from '../services/users/Repository/users.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }

