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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/application/services/users/users.service';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { RoleSettingCreateDto } from 'src/contracts/roleSetting/create-roleSetting.dto';
import { RoleSettingService } from 'src/application/services/roleSetting/roleSetting.service';
import { RoleService } from 'src/application/services/role/role.service';
import { RoleReadDto } from 'src/contracts/role/read-role.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { PostService } from 'src/application/services/post/post.service';
import { PostReadDto } from 'src/contracts/post/read-post.dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly organizationService: OrganizationService,
    private readonly roleSettingService: RoleSettingService,
    private readonly roleService: RoleService,
    private readonly postService: PostService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get(':organizationId/organization')
  @ApiOperation({ summary: 'Все пользователи в организации' })
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'Id организации',
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  async findAll(@Param('organizationId') organizationId: string): Promise<ReadUserDto[]> {
    return await this.usersService.findAllForOrganization(organizationId);
  }

  @Get(':orgainizationId/new')
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'orgainizationId',
    required: true,
    description: 'Id организации',
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  async beforeCreate(@Param('orgainizationId') orgainizationId: string): Promise<{postsWithoutUser: PostReadDto[], roles: RoleReadDto[]}> {
    const [postsWithoutUser, roles] = await Promise.all([
      this.postService.findAllWithoutUserForOrganization(orgainizationId),
      this.roleService.findAll()
    ])
    return  {postsWithoutUser: postsWithoutUser, roles: roles}
  }

  @Get(':userId')
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Пользователь не найден!`,
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
    return await this.usersService.findOne(id);
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать контакт' })
  @ApiBody({
    description: 'ДТО для создания юзера',
    type: CreateUserDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: { "id": "71ba1ba2-9e53-4238-9bb2-14a475460689" },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async create(
    @Body() userCreateDto: CreateUserDto,
  ): Promise<{ id: string }> {
    const [organization /**, role */] = await Promise.all([
      this.organizationService.findOneById(userCreateDto.organizationId, ['account']),
      // this.roleService.findOneById(userCreateDto.roleId)
    ])
    // userCreateDto.role = role;
    userCreateDto.organization = organization;
    userCreateDto.account = organization.account;
    const createdUserId = await this.usersService.create(userCreateDto);
    this.logger.info(
      `${yellow('OK!')} - userCreateDto: ${JSON.stringify(userCreateDto)} - Создан контакт!`,
    );
    return { id: createdUserId };
  }
}
