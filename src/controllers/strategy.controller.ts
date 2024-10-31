import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { StrategyCreateDto } from "src/contracts/strategy/create-strategy.dto";
import { UsersService } from "src/application/services/users/users.service";
import { Strategy } from "src/domains/strategy.entity";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { StrategyUpdateDto } from "src/contracts/strategy/update-strategy.dto";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { StrategyCreateEventDto } from "src/contracts/strategy/createEvent-strategy.dto";
import { ProducerService } from "src/application/services/producer/producer.service";

@ApiTags('Strategy')
@Controller(':userId/strategies')
export class StrategyController {
  constructor(
    private readonly strategyService: StrategyService,
    private readonly userService: UsersService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) { }


  @Patch(':strategyId/update')
  @ApiOperation({ summary: 'Обновить стратегию по Id' })
  @ApiBody({
    description: 'ДТО для обновления стратегии',
    type: StrategyUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: "ed2dfe55-b678-4f7e-a82e-ccf395afae05"
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'strategyId', required: true, description: 'Id политики' })
  async update(@Param('strategyId') strategyId: string, @Body() strategyUpdateDto: StrategyUpdateDto, @Ip() ip: string): Promise<string> {
    if(strategyUpdateDto.organizationId){
      const organization = await this.organizationService.findOneById(strategyUpdateDto.organizationId);
      strategyUpdateDto.organization = organization;
    }
    const updatedStrategyId = await this.strategyService.update(strategyId, strategyUpdateDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - strategyUpdateDto: ${JSON.stringify(strategyUpdateDto)} - Стратегия успешно обновлена!`);
    return updatedStrategyId;
  }


  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания новой стратегии' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: [
      {
        id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
        organizationName: "soplya firma",
        parentOrganizationId: null,
        createdAt: "2024-09-16T14:24:33.841Z",
        updatedAt: "2024-09-16T14:24:33.841Z"
      },
      {
        id: "1f1cca9a-2633-489c-8f16-cddd411ff2d0",
        organizationName: "OOO BOBRIK",
        parentOrganizationId: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
        createdAt: "2024-09-16T15:09:48.995Z",
        updatedAt: "2024-09-16T15:09:48.995Z"
      }
    ]
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<OrganizationReadDto[]> {
    const user = await this.userService.findOne(userId)
    const organizations = await this.organizationService.findAllForAccount(user.account);
    return organizations
  }


  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Все стратегии для организации' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
      organizationName: "soplya firma",
      parentOrganizationId: null,
      createdAt: "2024-09-16T14:24:33.841Z",
      updatedAt: "2024-09-16T14:24:33.841Z",
      strategyToOrganizations: [
        {
          id: "fe47c377-deaa-4fc5-8a30-c2006f09a463",
          createdAt: "2024-10-09T10:07:46.234Z",
          updatedAt: "2024-10-09T10:07:46.234Z",
          strategy: {
            id: "351e7c60-2881-4e09-bb7f-81cbd2eb0ea1",
            strategyNumber: 14,
            dateActive: "2024-10-09T10:07:43.253Z",
            content: "<p>HTML текстуууsadsadsaуxzc</p>\n",
            state: "Активный",
            createdAt: "2024-10-01T15:40:15.929Z",
            updatedAt: "2024-10-09T10:07:46.741Z"
          }
        },
      ]
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'organizationId', required: true, description: 'Id организации', example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f' })
  async findAll(@Param('organizationId') organizationId: string): Promise<OrganizationReadDto> {
    return await this.organizationService.findOneById(organizationId);
  }

  @Get(':strategyId')
  @ApiOperation({ summary: 'Получить стратегию по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      currentStrategy: {
        id: "21dcf96d-1e6a-4c8c-bc12-c90589b40e93",
        strategyNumber: 2,
        dateActive: null,
        content: "HTML текст",
        state: "Черновик",
        createdAt: "2024-09-20T14:35:56.273Z",
        updatedAt: "2024-09-20T14:35:56.273Z",
        strategyToOrganizations: [
          {
            id: "8acc62ce-47dc-4f09-a3f8-83927a6e1efe",
            createdAt: "2024-09-20T14:35:56.918Z",
            updatedAt: "2024-09-20T14:35:56.918Z",
            organization: {
              id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
              organizationName: "soplya firma",
              parentOrganizationId: null,
              createdAt: "2024-09-16T14:24:33.841Z",
              updatedAt: "2024-09-16T14:24:33.841Z"
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Стратегия не найдена!` })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'strategyId', required: true, description: 'Id политики' })
  async findOne(@Param('strategyId') strategyId: string, @Ip() ip: string): Promise<{ currentStrategy: StrategyReadDto }> {
    const strategy = await this.strategyService.findOneById(strategyId);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT STRATEGY: ${JSON.stringify(strategy)} - Получить стратегию по ID!`);
    return { currentStrategy: strategy }
  }




  @Post('new')
  @ApiOperation({ summary: 'Создать стратегию' })
  @ApiBody({
    description: 'ДТО для создания цели',
    type: StrategyCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example:
    {
      content: "HTML текст",
      state: "Черновик",
      user: {
        id: "3b809c42-2824-46c1-9686-dd666403402a",
        firstName: "Maxik",
        lastName: "Koval",
        telegramId: 453120600,
        telephoneNumber: null,
        avatar_url: null,
        vk_id: null,
        createdAt: "2024-09-16T14:03:31.000Z",
        updatedAt: "2024-09-16T14:03:31.000Z",
        organization: {
          id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
          organizationName: "soplya firma",
          parentOrganizationId: null,
          createdAt: "2024-09-16T14:24:33.841Z",
          updatedAt: "2024-09-16T14:24:33.841Z"
        },
        account: {
          id: "a1118813-8985-465b-848e-9a78b1627f11",
          accountName: "OOO PIPKA",
          createdAt: "2024-09-16T12:53:29.593Z",
          updatedAt: "2024-09-16T12:53:29.593Z"
        }
      },
      account: {
        id: "a1118813-8985-465b-848e-9a78b1627f11",
        accountName: "OOO PIPKA",
        createdAt: "2024-09-16T12:53:29.593Z",
        updatedAt: "2024-09-16T12:53:29.593Z"
      },
      dateActive: null,
      id: "21dcf96d-1e6a-4c8c-bc12-c90589b40e93",
      strategyNumber: 2,
      createdAt: "2024-09-20T14:35:56.273Z",
      updatedAt: "2024-09-20T14:35:56.273Z"
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Body() strategyCreateDto: StrategyCreateDto, @Ip() ip: string): Promise<{id: string}> {
    const [user, organization] = await Promise.all([
      this.userService.findOne(userId),
      this.organizationService.findOneById(strategyCreateDto.organizationId)
    ]);
    strategyCreateDto.user = user;
    strategyCreateDto.account = user.account;
    strategyCreateDto.organization = organization;
    const createdStrategyId = await this.strategyService.create(strategyCreateDto);
    const createdStrategyEventDto: StrategyCreateEventDto = {
      eventType: 'STRATEGY_CREATED',
      id: createdStrategyId,
      content: strategyCreateDto.content,
      userId: user.id,
      accountId: user.account.id,
      organizationId: strategyCreateDto.organizationId
    }
    await this.producerService.sendCreatedStrategyToQueue(createdStrategyEventDto);

    this.logger.info(`${yellow('OK!')} - ${red(ip)} - strategyCreateDto: ${JSON.stringify(strategyCreateDto)} - Создана новая стратегия!`)
    return {id: createdStrategyId}
  }


}