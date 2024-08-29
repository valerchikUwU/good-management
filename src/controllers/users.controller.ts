import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from 'src/application/services/users/users.service';
import { ReadUserDto } from 'src/contracts/read-user.dto';
import { CreateUserDto } from 'src/contracts/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): Promise<ReadUserDto[]> {
        return this.usersService.findAll();
    }


    @Get(':id')
    findOne(@Param('id') id: string): Promise<ReadUserDto | null> {
        return this.usersService.findOne(id);
    }

    @Get('telegram/:telegramId')
    findOneByTelegramId(@Param('telegramId') telegramId: number): Promise<ReadUserDto | null> {
        return this.usersService.findOneByTelegramId(telegramId);
    }


    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.usersService.remove(id);
    }

    @Post('new')
    create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
        return this.usersService.create(createUserDto);
    }
}
