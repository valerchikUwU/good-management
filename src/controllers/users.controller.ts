import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from 'src/application/services/users/users.service';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<ReadUserDto[]> {
        return this.usersService.findAll();
    }


    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReadUserDto | null> {
        return this.usersService.findOne(id);
    }

    @Get('telegram/:telegramId')
    async findOneByTelegramId(@Param('telegramId') telegramId: number): Promise<ReadUserDto | null> {
        return this.usersService.findOneByTelegramId(telegramId);
    }


    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }

    @Post('new')
    async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
        return this.usersService.create(createUserDto);
    }

}
