import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Body,
  Post,
  Inject,
  Ip,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { UsersService } from 'src/application/services/users/users.service';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PolicyCreateDto } from 'src/contracts/policy/create-policy.dto';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { OrganizationReadDto } from 'src/contracts/organization/read-organization.dto';
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

@ApiTags('Policy')
// @UseGuards(AccessTokenGuard)
@Controller(':userId/policies')
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly userService: UsersService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Все политики' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
        policyName: 'asdasd',
        policyNumber: 1,
        state: 'Черновик',
        type: 'Директива',
        dateActive: null,
        content: 'string',
        createdAt: '2024-09-18T14:59:47.010Z',
        updatedAt: '2024-09-18T14:59:47.010Z',
      },
      {
        id: 'f6e3ac1f-afd9-42c1-a9f3-d189961c325c',
        policyName: 'Пипка',
        policyNumber: 2,
        state: 'Черновик',
        type: 'Директива',
        dateActive: null,
        content: 'попа',
        createdAt: '2024-09-18T15:06:52.222Z',
        updatedAt: '2024-09-18T15:06:52.222Z',
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
  async findAll(
    @Param('userId') userId: string,
    @Ip() ip: string,
  ): Promise<{
    policies: PolicyReadDto[];
    directives: PolicyReadDto[];
    instructions: PolicyReadDto[];
  }> {
    const user = await this.userService.findOne(userId, ['account']);
    const policies = await this.policyService.findAllForAccount(user.account);
    const directives = policies.filter((policy) => policy.type === Type.DIRECTIVE);
    const instructions = policies.filter((policy) => policy.type === Type.INSTRUCTION);
    return {
      policies: policies,
      directives: directives,
      instructions: instructions,
    };
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания новой политики' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      directives: [
        {
          id: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
          policyName: 'asdasd',
          policyNumber: 1,
          state: 'Черновик',
          type: 'Директива',
          dateActive: null,
          content: 'string',
          createdAt: '2024-09-18T14:59:47.010Z',
          updatedAt: '2024-09-18T14:59:47.010Z',
        },
      ],
      instructions: [],
      policies: [
        {
          id: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
          policyName: 'asdasd',
          policyNumber: 1,
          state: 'Черновик',
          type: 'Директива',
          dateActive: null,
          content: 'string',
          createdAt: '2024-09-18T14:59:47.010Z',
          updatedAt: '2024-09-18T14:59:47.010Z',
          account: {
            id: 'a1118813-8985-465b-848e-9a78b1627f11',
            accountName: 'OOO PIPKA',
            createdAt: '2024-09-16T12:53:29.593Z',
            updatedAt: '2024-09-16T12:53:29.593Z',
          },
        },
      ],
      organizations: [
        {
          id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          organizationName: 'soplya firma',
          parentOrganizationId: null,
          createdAt: '2024-09-16T14:24:33.841Z',
          updatedAt: '2024-09-16T14:24:33.841Z',
        },
        {
          id: '1f1cca9a-2633-489c-8f16-cddd411ff2d0',
          organizationName: 'OOO BOBRIK',
          parentOrganizationId: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          createdAt: '2024-09-16T15:09:48.995Z',
          updatedAt: '2024-09-16T15:09:48.995Z',
        },
      ],
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
  async beforeCreate(
    @Param('userId') userId: string,
    @Ip() ip: string,
  ): Promise<{
    directives: PolicyReadDto[];
    instructions: PolicyReadDto[];
    policies: PolicyReadDto[];
    organizations: OrganizationReadDto[];
  }> {
    const user = await this.userService.findOne(userId, ['account']);
    const policies = await this.policyService.findAllForAccount(user.account);
    const directives = policies.filter(
      (policy) => policy.type === Type.DIRECTIVE,
    );
    const instructions = policies.filter(
      (policy) => policy.type === Type.INSTRUCTION,
    );
    const organizations = await this.organizationService.findAllForAccount(
      user.account,
    );
    return {
      directives: directives,
      instructions: instructions,
      policies: policies,
      organizations: organizations,
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
    example: '3bfe46ff-a10b-4f55-a865-5ed478f4347d',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Политика не найдена!`,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
  async update(
    @Param('userId') userId: string,
    @Param('policyId') policyId: string,
    @Body() policyUpdateDto: PolicyUpdateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const [user, organization] = await Promise.all([
      await this.userService.findOne(userId, ['account']),
      policyUpdateDto.organizationId !== undefined
      ? this.organizationService.findOneById(policyUpdateDto.organizationId)
      : Promise.resolve(null) // возвращаем "пустое" значение, если условие не выполняется
    ])
    if(organization !== null){
      policyUpdateDto.organization = organization
    }
    const updatedPolicyId = await this.policyService.update(
      policyId,
      policyUpdateDto,
    );
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
      organizationId:
        policyUpdateDto.organizationId !== undefined
          ? policyUpdateDto.organizationId
          : null,
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
      `${yellow('OK!')} - ${red(ip)} - UPDATED POLICY: ${JSON.stringify(policyUpdateDto)} - Политика успешно обновлена!`,
    );
    return { id: updatedPolicyId };
  }

  @Get(':policyId')
  // @UseGuards(PermissionsGuard)
  // @ModuleAccess(Modules.POLICY)
  // @ActionAccess(Actions.READ)
  @ApiOperation({ summary: 'Получить политику по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      currentPolicy: {
        id: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
        policyName: 'asdasd',
        policyNumber: 1,
        state: 'Черновик',
        type: 'Директива',
        dateActive: null,
        content: 'string',
        createdAt: '2024-09-18T14:59:47.010Z',
        updatedAt: '2024-09-18T14:59:47.010Z',
        organization:
        {
          id: 'ea83fa12-2153-4851-ad0a-cc5fc29450ab',
          createdAt: '2024-09-18T14:59:47.577Z',
          updatedAt: '2024-09-18T14:59:47.577Z',
          organization: {
            id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
            organizationName: 'soplya firma',
            parentOrganizationId: null,
            createdAt: '2024-09-16T14:24:33.841Z',
            updatedAt: '2024-09-16T14:24:33.841Z',
          },
        },
      },
      organizations: [
        {
          id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          organizationName: 'soplya firma',
          parentOrganizationId: null,
          createdAt: '2024-09-16T14:24:33.841Z',
          updatedAt: '2024-09-16T14:24:33.841Z',
        },
        {
          id: '1f1cca9a-2633-489c-8f16-cddd411ff2d0',
          organizationName: 'OOO BOBRIK',
          parentOrganizationId: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          createdAt: '2024-09-16T15:09:48.995Z',
          updatedAt: '2024-09-16T15:09:48.995Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Политика не найдена!`,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
  async findOne(
    @Param('userId') userId: string,
    @Param('policyId') policyId: string,
    @Ip() ip: string,
  ): Promise<{
    currentPolicy: PolicyReadDto;
    organizations: OrganizationReadDto[];
  }> {
    const policy = await this.policyService.findOneById(policyId, [
      'organization',
    ]);
    const user = await this.userService.findOne(userId, ['account']);
    const organizations = await this.organizationService.findAllForAccount(
      user.account,
    );
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - CURRENT POLICY: ${JSON.stringify(policy)} - Получить политику по ID!`,
    );
    return { currentPolicy: policy, organizations: organizations };
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
    example: '71ba1ba2-9e53-4238-9bb2-14a475460689',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async create(
    @Param('userId') userId: string,
    @Body() policyCreateDto: PolicyCreateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const [user, organization] = await Promise.all([
      await this.userService.findOne(userId, ['account']),
      await this.organizationService.findOneById(policyCreateDto.organizationId)
    ])
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
      `${yellow('OK!')} - ${red(ip)} - policyCreateDto: ${JSON.stringify(policyCreateDto)} - Создана новая политика!`,
    );
    return { id: createdPolicyId };
  }
}
