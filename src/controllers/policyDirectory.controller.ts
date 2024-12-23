import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Ip,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PolicyDirectoryService } from 'src/application/services/policyDirectory/policyDirectory.service';
import { UsersService } from 'src/application/services/users/users.service';
import { PolicyDirectoryCreateDto } from 'src/contracts/policyDirectory/create-policyDirectory.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PolicyDirectory } from 'src/domains/policyDirectory.entity';
import { PolicyDirectoryReadDto } from 'src/contracts/policyDirectory/read-policyDirectory.dto';
import { PolicyDirectoryUpdateDto } from 'src/contracts/policyDirectory/update-policyDirectory.dto';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { Type } from 'src/domains/policy.entity';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';
import { Request as ExpressRequest } from 'express';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { OrganizationService } from 'src/application/services/organization/organization.service';

@ApiTags('PolicyDirectories')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('policyDirectory')
export class PolicyDirectoryController {
  constructor(
    private readonly policyDirectoryService: PolicyDirectoryService,
    private readonly organizationService: OrganizationService,
    private readonly policyService: PolicyService,
    @Inject('winston') private readonly logger: Logger,
  ) { }


  @Get(':organizationId')
  @ApiOperation({ summary: 'Все папки в организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        "id": "4607b481-7933-4fb6-b707-e15d8881093b",
        "directoryName": "максик плюс плюс",
        "createdAt": "2024-12-20T12:47:29.014Z",
        "updatedAt": "2024-12-20T12:47:29.014Z",
        "policyToPolicyDirectories": [
          {
            "id": "a4f5eb5e-e01e-42c1-b468-b70c6736c650",
            "createdAt": "2024-12-20T12:47:29.248Z",
            "updatedAt": "2024-12-20T12:47:29.248Z",
            "policy": {
              "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
              "policyName": "Привет",
              "policyNumber": 152,
              "state": "Активный",
              "type": "Директива",
              "dateActive": "2024-12-20T11:14:27.156Z",
              "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
              "createdAt": "2024-12-12T13:30:48.085Z",
              "updatedAt": "2024-12-20T11:14:27.436Z"
            }
          }
        ]
      }
    ]
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
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167'
  })
  async findAll(
    @Param('organizationId') organizationId: string
  ): Promise<PolicyDirectoryReadDto[]> {
    const policyDirectories = await this.policyDirectoryService.findAllForOrganization(organizationId, ['policyToPolicyDirectories.policy']);
    return policyDirectories;
  }




  @Get(':organizationId/:policyDirectoryId/policyDirectory') // для мобилки
  @ApiOperation({ summary: 'Получить папку по ID (для мобильной версии)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "policyDirectory": {
        "id": "4607b481-7933-4fb6-b707-e15d8881093b",
        "directoryName": "максик плюс плюс",
        "createdAt": "2024-12-20T12:47:29.014Z",
        "updatedAt": "2024-12-20T12:47:29.014Z",
        "policyToPolicyDirectories": [
          {
            "id": "a4f5eb5e-e01e-42c1-b468-b70c6736c650",
            "createdAt": "2024-12-20T12:47:29.248Z",
            "updatedAt": "2024-12-20T12:47:29.248Z",
            "policy": {
              "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
              "policyName": "Привет",
              "policyNumber": 152,
              "state": "Активный",
              "type": "Директива",
              "dateActive": "2024-12-20T11:14:27.156Z",
              "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
              "createdAt": "2024-12-12T13:30:48.085Z",
              "updatedAt": "2024-12-20T11:14:27.436Z"
            }
          }
        ]
      },
      "instructions": [],
      "directives": [
        {
          "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
          "policyName": "Привет",
          "policyNumber": 152,
          "state": "Активный",
          "type": "Директива",
          "dateActive": "2024-12-20T11:14:27.156Z",
          "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
          "createdAt": "2024-12-12T13:30:48.085Z",
          "updatedAt": "2024-12-20T11:14:27.436Z"
        }
      ]
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Папка не найдена!`
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'policyDirectoryId',
    required: true,
    description: 'Id папки'
  })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'Id организации',
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167'
  })
  async findOne(
    @Param('organizationId') organizationId: string,
    @Param('policyDirectoryId') policyDirectoryId: string,
  ): Promise<{ policyDirectory: PolicyDirectoryReadDto, directives: PolicyReadDto[], instructions: PolicyReadDto[] }> {
    const [policyDirectory, policiesActive] = await Promise.all([
      this.policyDirectoryService.findOneById(policyDirectoryId, ['policyToPolicyDirectories.policy']),
      this.policyService.findAllActiveForOrganization(organizationId)
    ])
    const directives = policiesActive.filter((policy) => policy.type === Type.DIRECTIVE);
    const instructions = policiesActive.filter((policy) => policy.type === Type.INSTRUCTION);
    return { policyDirectory: policyDirectory, instructions: instructions, directives: directives };
  }



  @Post('new')
  @ApiOperation({ summary: 'Создать папку для политик' })
  @ApiBody({
    description: 'ДТО для создания папки',
    type: PolicyDirectoryCreateDto,
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
    @Req() req: ExpressRequest,
    @Body() policyDirectoryCreateDto: PolicyDirectoryCreateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    policyDirectoryCreateDto.account = user.account;
    const createdPolicyDirectory = await this.policyDirectoryService.create(policyDirectoryCreateDto);
    this.logger.info(
      `${yellow('OK!')} - policyDirectoryCreateDto: ${JSON.stringify(policyDirectoryCreateDto)} - Создана новая папка!`,
    );
    return { id: createdPolicyDirectory.id };
  }

  @Patch(':policyDirectoryId/update')
  @ApiOperation({ summary: 'Обновить папку для политик' })
  @ApiBody({
    description: 'ДТО для обновления папки',
    type: PolicyDirectoryUpdateDto,
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
    status: HttpStatus.NOT_FOUND,
    description: 'Папка не найдена!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'policyDirectoryId',
    required: true,
    description: 'Id папки',
    example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988',
  })
  async update(
    @Param('policyDirectoryId') policyDirectoryId: string,
    @Body() policyDirectoryUpdateDto: PolicyDirectoryUpdateDto,
  ): Promise<{ id: string }> {
    const updatedPolicyDirectory = await this.policyDirectoryService.update(
      policyDirectoryId,
      policyDirectoryUpdateDto,
    );
    this.logger.info(
      `${yellow('OK!')} - UPDATED POLICYDIRECTORY: ${JSON.stringify(policyDirectoryUpdateDto)} - Папка успешно обновлена!`,
    );
    return { id: updatedPolicyDirectory.id };
  }

  @Delete(':policyDirectoryId/remove')
  @ApiOperation({ summary: 'Удалить папку' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: {"message": "Папка успешно удалена!" },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Папка не найдена!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'policyDirectoryId',
    required: true,
    description: 'Id папки',
    example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988',
  })
  async remove(
    @Param('policyDirectoryId') policyDirectoryId: string,
  ) {
    await this.policyDirectoryService.remove(policyDirectoryId);
    return { message: "Папка успешно удалена!" }
  }
}
