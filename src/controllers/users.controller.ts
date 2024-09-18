import { Controller, Get, Post, Delete, Param, Body, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/application/services/users/users.service';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Все пользователи' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        type: ReadUserDto,
        isArray: true,
        example:
            [
                {
                    id: '98ea2391-3643-40f3-9fe8-779d266faef6',
                    firstName: 'Maxik',
                    lastName: 'Koval',
                    telegramId: 1313131313,
                    telephoneNumber: '+79787513901',
                    avatar_url: 'https://avatar/img.png',
                    vk_id: 123123123,
                    createdAt: "1900-01-01 00:00:00",
                    updatedAt: "1900-01-01 00:00:00",
                }
            ]
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(): Promise<ReadUserDto[]> {
        return this.usersService.findAll();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Получить пользователя по Id' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        type: ReadUserDto,
        example: {

            id: '98ea2391-3643-40f3-9fe8-779d266faef6',
            firstName: 'Maxik',
            lastName: 'Koval',
            telegramId: 1313131313,
            telephoneNumber: '+79787513901',
            avatar_url: 'https://avatar/img.png',
            vk_id: 123123123,
            createdAt: "1900-01-01 00:00:00",
            updatedAt: "1900-01-01 00:00:00",
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findOne(@Param('id') id: string): Promise<ReadUserDto | null> {
        return this.usersService.findOne(id);
    }

    @Get('telegram/:telegramId')
    @ApiOperation({ summary: 'Получить пользователя по телеграм Id' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            id: '98ea2391-3643-40f3-9fe8-779d266faef6',
            firstName: 'Maxik',
            lastName: 'Koval',
            telegramId: 1313131313,
            telephoneNumber: '+79787513901',
            avatar_url: 'https://avatar/img.png',
            vk_id: 123123123,
            createdAt: "1900-01-01 00:00:00",
            updatedAt: "1900-01-01 00:00:00",
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findOneByTelegramId(@Param('telegramId') telegramId: number): Promise<ReadUserDto | null> {
        return this.usersService.findOneByTelegramId(telegramId);
    }

}
