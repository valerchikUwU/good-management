import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { OrganizationCreateDto } from 'src/contracts/organization/create-organization.dto';
import { OrganizationReadDto } from 'src/contracts/organization/read-organization.dto';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationUpdateDto } from 'src/contracts/organization/update-organization.dto';
import { Logger } from 'winston';
import { red, yellow } from 'colorette';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request as ExpressRequest } from 'express';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';

@UseGuards(AccessTokenGuard)
@ApiTags('Organization')
@ApiBearerAuth('access-token') // Указывает использовать схему Bearer
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Все организации в аккаунте' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
        "organizationName": "Калоеды",
        "parentOrganizationId": null,
        "reportDay": 2,
        "createdAt": "2024-12-04T13:14:47.767Z",
        "updatedAt": "2024-12-06T07:09:10.117Z",
        "users": [
          {
            "id": "bc807845-08a8-423e-9976-4f60df183ae2",
            "firstName": "Максим",
            "lastName": "Ковальская",
            "middleName": "Тимофеевич",
            "telegramId": 453120600,
            "telephoneNumber": "+79787513901",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-04T13:16:56.785Z",
            "updatedAt": "2024-12-04T15:37:36.501Z"
          }
        ]
      },
      {
        "id": "392ce79a-c35f-4e00-9c3b-8b7b667c8465",
        "organizationName": "Академия",
        "parentOrganizationId": null,
        "reportDay": 5,
        "createdAt": "2024-12-04T13:28:42.823Z",
        "updatedAt": "2024-12-04T13:28:42.823Z",
        "users": []
      }
    ]
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  async findAll(
    @Req() req: ExpressRequest
  ): Promise<OrganizationReadDto[]> {
    const user = req.user as ReadUserDto; // Здесь доступен пользователь из AccessJwtStrategy
    return await this.organizationService.findAllForAccount(user.account, ['users']);
  }

  @Patch(':organizationId/update')
  @ApiOperation({ summary: 'Обновить данные об организации по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {"id": "2d1cea4c-7cea-4811-8cd5-078da7f20167"},
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'Id организации',
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167'
  })
  async update(
    @Param('organizationId') organizationId: string,
    @Body() organizationUpdateDto: OrganizationUpdateDto,
  ): Promise<{ id: string }> {
    const updatedOrganizationId = await this.organizationService.update(organizationId, organizationUpdateDto);
    this.logger.info(
      `${yellow('OK!')} - UPDATED ORGANIZATION: ${JSON.stringify(organizationUpdateDto)} - Организация успешно обновлена!`,
    );
    return { id: updatedOrganizationId };
  }

  @Post('new')
  @ApiOperation({ summary: 'Добавить организацию в аккаунт' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {"id": "2d1cea4c-7cea-4811-8cd5-078da7f20167"},
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
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  async create(
    @Req() req: ExpressRequest,
    @Body() organizationCreateDto: OrganizationCreateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    organizationCreateDto.account = user.account;
    const createdOrganizationId = await this.organizationService.create(organizationCreateDto);
    return { id: createdOrganizationId };
  }
}
