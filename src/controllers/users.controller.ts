import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpStatus,
  Inject,
  Ip,
} from '@nestjs/common';
import { UsersService } from 'src/application/services/users/users.service';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/domains/user.entity';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { RoleSettingCreateDto } from 'src/contracts/roleSetting/create-roleSetting.dto';
import { RoleSettingService } from 'src/application/services/roleSetting/roleSetting.service';
import { RoleService } from 'src/application/services/role/role.service';
import { RoleReadDto } from 'src/contracts/role/read-role.dto';

@ApiTags('User')
@Controller(':userId/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleSettingService: RoleSettingService,
    private readonly roleService: RoleService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Все пользователи' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    type: ReadUserDto,
    isArray: true,
    example: [
      {
        id: '98ea2391-3643-40f3-9fe8-779d266faef6',
        firstName: 'Maxik',
        lastName: 'Koval',
        telegramId: 1313131313,
        telephoneNumber: '+79787513901',
        avatar_url: 'https://avatar/img.png',
        vk_id: 123123123,
        createdAt: '1900-01-01 00:00:00',
        updatedAt: '1900-01-01 00:00:00',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  async findAll(@Param('userId') userId: string): Promise<ReadUserDto[]> {
    const user = await this.usersService.findOne(userId, ['account']);
    return this.usersService.findAllForAccount(user.account);
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания юзера' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    type: ReadUserDto,
    example: {
      id: '98ea2391-3643-40f3-9fe8-779d266faef6',
      firstName: 'Maxik',
      lastName: 'Koval',
      telegramId: 1313131313,
      telephoneNumber: '+79787513901',
      avatar_url: 'https://avatar/img.png',
      vk_id: 123123123,
      createdAt: '1900-01-01 00:00:00',
      updatedAt: '1900-01-01 00:00:00',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  async beforeCreate(): Promise<RoleReadDto[]> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    type: ReadUserDto,
    example: {
      id: '98ea2391-3643-40f3-9fe8-779d266faef6',
      firstName: 'Maxik',
      lastName: 'Koval',
      telegramId: 1313131313,
      telephoneNumber: '+79787513901',
      avatar_url: 'https://avatar/img.png',
      vk_id: 123123123,
      createdAt: '1900-01-01 00:00:00',
      updatedAt: '1900-01-01 00:00:00',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  async findOne(@Param('id') id: string): Promise<ReadUserDto> {
    return this.usersService.findOne(id);
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать контакт' })
  @ApiBody({
    description: 'ДТО для создания юзера',
    type: CreateUserDto,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  async create(
    @Param('userId') userId: string,
    @Body() userCreateDto: CreateUserDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const user = await this.usersService.findOne(userId, ['account']);
    const role = await this.roleService.findOneById(userCreateDto.roleId);
    userCreateDto.account = user.account;
    userCreateDto.role = role;
    const createdUserId = await this.usersService.create(userCreateDto);
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - userCreateDto: ${JSON.stringify(userCreateDto)} - Создан юзер!`,
    );
    return { id: createdUserId };
  }
}
