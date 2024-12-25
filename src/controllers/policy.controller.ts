import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Body,
  Post,
  Inject,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PolicyCreateDto } from 'src/contracts/policy/create-policy.dto';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PolicyUpdateDto } from 'src/contracts/policy/update-policy.dto';
import { ModuleAccess } from 'src/decorators/module-access.decorator';
import { ActionAccess } from 'src/decorators/action-access.decorator';
import { Actions, Modules } from 'src/domains/roleSetting.entity';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PolicyCreateEventDto } from 'src/contracts/policy/createEvent-policy.dto';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { State, Type } from 'src/domains/policy.entity';
import { PolicyUpdateEventDto } from 'src/contracts/policy/updateEvent-policy.dto';
import { TimeoutError } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';

@ApiTags('Policy')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('policies')
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get(':organizationId')
  @ApiOperation({ summary: 'Все политики в организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "directives": [
        {
          "id": "7e1de0a5-b736-416f-82ab-7968db43115e",
          "policyName": "Папка",
          "policyNumber": 156,
          "state": "Черновик",
          "type": "Директива",
          "dateActive": "2024-12-12T16:41:56.829Z",
          "content": "Папка",
          "createdAt": "2024-12-12T16:41:57.005Z",
          "updatedAt": "2024-12-12T17:21:17.051Z"
        }
      ],
      "instructions": [
        {
          "id": "15d5f40c-9b02-473f-8ce7-48efc0be14ac",
          "policyName": "Сейчас",
          "policyNumber": 153,
          "state": "Черновик",
          "type": "Инструкция",
          "dateActive": null,
          "content": "Привет",
          "createdAt": "2024-12-12T13:43:51.479Z",
          "updatedAt": "2024-12-13T12:55:38.152Z"
        }
      ]
    }
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
  ): Promise<{
    directives: PolicyReadDto[];
    instructions: PolicyReadDto[];
  }> {
    const policies = await this.policyService.findAllForOrganization(organizationId);
    const directives = policies.filter((policy) => policy.type === Type.DIRECTIVE);
    const instructions = policies.filter((policy) => policy.type === Type.INSTRUCTION);
    return {
      directives: directives,
      instructions: instructions,
    };
  }


  @Patch(':policyId/update')
  @ApiOperation({ summary: 'Обновить политику по Id' })
  @ApiBody({
    description: 'ДТО для обновления политики',
    type: PolicyUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {"id": "71ba1ba2-9e53-4238-9bb2-14a475460689"},
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Политика не найдена!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
  async update(
    @Req() req: ExpressRequest,
    @Param('policyId') policyId: string,
    @Body() policyUpdateDto: PolicyUpdateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const updatedPolicyId = await this.policyService.update(policyId, policyUpdateDto);
    const updatedEventPolicyDto: PolicyUpdateEventDto = {
      eventType: 'POLICY_UPDATED',
      id: updatedPolicyId,
      policyName:
        policyUpdateDto.policyName !== undefined
          ? policyUpdateDto.policyName
          : null,
      state:
        policyUpdateDto.state !== undefined
          ? (policyUpdateDto.state as string)
          : null,
      type:
        policyUpdateDto.type !== undefined
          ? (policyUpdateDto.type as string)
          : null,
      content:
        policyUpdateDto.content !== undefined ? policyUpdateDto.content : null,
      updatedAt: new Date(),
      accountId: user.account.id,
    };
    try {
      await Promise.race([
        this.producerService.sendUpdatedPolicyToQueue(updatedEventPolicyDto),
        new Promise((_, reject) =>
          setTimeout(() => reject(new TimeoutError()), 5000),
        ),
      ]);
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error(
          `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
        );
      } else {
        this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
      }
    }
    this.logger.info(
      `${yellow('OK!')} - UPDATED POLICY: ${JSON.stringify(policyUpdateDto)} - Политика успешно обновлена!`,
    );
    return { id: updatedPolicyId };
  }

  @Get(':policyId/policy')
  // @UseGuards(PermissionsGuard)
  // @ModuleAccess(Modules.POLICY)
  // @ActionAccess(Actions.READ)
  @ApiOperation({ summary: 'Получить политику по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "id": "15d5f40c-9b02-473f-8ce7-48efc0be14ac",
      "policyName": "Сейчас",
      "policyNumber": 153,
      "state": "Черновик",
      "type": "Инструкция",
      "dateActive": null,
      "content": "Привет",
      "createdAt": "2024-12-12T13:43:51.479Z",
      "updatedAt": "2024-12-13T12:55:38.152Z"
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Политика не найдена!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
  async findOne(
    @Param('policyId') policyId: string
  ): Promise<PolicyReadDto> {
    const policy = await this.policyService.findOneById(policyId);
    return policy;
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать политику' })
  @ApiBody({
    description: 'ДТО для создания политики',
    type: PolicyCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: {"id": "71ba1ba2-9e53-4238-9bb2-14a475460689"},
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
    @Body() policyCreateDto: PolicyCreateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const organization = await this.organizationService.findOneById(policyCreateDto.organizationId)
    policyCreateDto.organization = organization;
    policyCreateDto.user = user;
    policyCreateDto.account = user.account;
    const createdPolicyId = await this.policyService.create(policyCreateDto);
    const createdEventPolicyDto: PolicyCreateEventDto = {
      eventType: 'POLICY_CREATED',
      id: createdPolicyId,
      policyName: policyCreateDto.policyName,
      state:
        policyCreateDto.state !== undefined
          ? (policyCreateDto.state as string)
          : (State.DRAFT as string),
      type:
        policyCreateDto.type !== undefined
          ? (policyCreateDto.type as string)
          : (Type.DIRECTIVE as string),
      content: policyCreateDto.content,
      createdAt: new Date(),
      userId: user.id,
      accountId: user.account.id,
      organizationId: policyCreateDto.organizationId,
    };
    try {
      await Promise.race([
        this.producerService.sendCreatedPolicyToQueue(createdEventPolicyDto),
        new Promise((_, reject) =>
          setTimeout(() => reject(new TimeoutError()), 5000),
        ),
      ]);
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error(
          `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
        );
      } else {
        this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
      }
    }
    this.logger.info(
      `${yellow('OK!')} - policyCreateDto: ${JSON.stringify(policyCreateDto)} - Создана новая политика!`,
    );
    return { id: createdPolicyId };
  }
}
