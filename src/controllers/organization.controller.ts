import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { UsersService } from 'src/application/services/users/users.service';
import { OrganizationCreateDto } from 'src/contracts/organization/create-organization.dto';
import { OrganizationReadDto } from 'src/contracts/organization/read-organization.dto';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationUpdateDto } from 'src/contracts/organization/update-organization.dto';

@ApiTags('Organization')
@Controller(':userId/organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Все организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
        organizationName: 'soplya firma',
        parentOrganizationId: null,
        createdAt: '2024-09-16T14:24:33.841Z',
        updatedAt: '2024-09-16T14:24:33.841Z',
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
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async findOrganization(
    @Param('userId') userId: string,
  ): Promise<OrganizationReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    return await this.organizationService.findAllForAccount(user.account);
  }

  @Patch(':organizationId/update')
  @ApiOperation({ summary: 'Обновить данные об организации по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {},
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'Id организации',
  })
  async update(
    @Param('userId') userId: string,
    @Param('organizationId') organizationId: string,
    @Body() organizationUpdateDto: OrganizationUpdateDto,
  ): Promise<OrganizationReadDto> {
    return await this.organizationService.update(
      organizationId,
      organizationUpdateDto,
    );
  }

  @Post('new')
  @ApiOperation({ summary: 'Добавить организацию' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      organizationName: 'soplya firma',
      parentOrganizationId: null,
      account: {
        id: 'a1118813-8985-465b-848e-9a78b1627f11',
        accountName: 'OOO PIPKA',
        createdAt: '2024-09-16T12:53:29.593Z',
        updatedAt: '2024-09-16T12:53:29.593Z',
      },
      id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
      createdAt: '2024-09-16T14:24:33.841Z',
      updatedAt: '2024-09-16T14:24:33.841Z',
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
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async create(
    @Param('userId') userId: string,
    @Body() organizationCreateDto: OrganizationCreateDto,
  ): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId, ['account']);
    organizationCreateDto.account = user.account;
    const createdOrganizationId = await this.organizationService.create(
      organizationCreateDto,
    );
    return { id: createdOrganizationId };
  }
}
