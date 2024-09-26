import { Controller, Get, Post, HttpStatus, Param, Body, Patch, Inject, Ip } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GoalService } from "src/application/services/goal/goal.service";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { UsersService } from "src/application/services/users/users.service";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { GoalUpdateDto } from "src/contracts/goal/update-goal.dto";
import { Goal } from "src/domains/goal.entity";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";


@ApiTags('Goal')
@Controller(':userId/goals')
export class GoalController {
  constructor(
    private readonly goalService: GoalService,
    private readonly userService: UsersService,
    private readonly organizationService: OrganizationService,
    @Inject('winston') private readonly logger: Logger
  ) { }

  @Get()
  @ApiOperation({ summary: 'Все цели' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: [
      {
        id: "907b0875-d29d-4f84-89fe-6b037d1ecc7f",
        goalName: "Перепукать шматика №1",
        orderNumber: 1,
        content: "Надо перепукать шмутзеля",
        createdAt: "2024-09-18T14:11:27.918Z",
        updatedAt: "2024-09-18T14:11:27.918Z",
        goalToOrganizations: [
          {
            id: "00eb152b-43a5-483d-9085-c46c23873a3d",
            createdAt: "2024-09-18T14:11:28.433Z",
            updatedAt: "2024-09-18T14:11:28.433Z",
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
    ]
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<GoalReadDto[]> {
    const user = await this.userService.findOne(userId);
    const goals = await this.goalService.findAllForAccount(user.account);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - GOALS: ${JSON.stringify(goals)} - ВСЕ ЦЕЛИ!`);
    return goals;
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания новой цели' })
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


  @Patch(':goalId/update')
  @ApiOperation({ summary: 'Обновить цель по ID' })
  @ApiBody({
    description: 'ДТО для обновления цели',
    type: GoalUpdateDto,
    required: true,
  })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'goalId', required: true, description: 'Id цели' })
  async update(@Param('userId') userId: string, goalId: string, @Body() goalUpdateDto: GoalUpdateDto, @Ip() ip: string): Promise<GoalReadDto> {
    const updatedGoal = await this.goalService.update(goalId, goalUpdateDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED GOAL: ${JSON.stringify(goalUpdateDto)} - Цель успешно обновлена!`);
    return 
  }

  @Get(':goalId')
  @ApiOperation({ summary: 'Получить цель по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
        id: "907b0875-d29d-4f84-89fe-6b037d1ecc7f",
        goalName: "Перепукать шматика №1",
        orderNumber: 1,
        content: "Надо перепукать шмутзеля",
        createdAt: "2024-09-18T14:11:27.918Z",
        updatedAt: "2024-09-18T14:11:27.918Z",
        user: {
          id: "3b809c42-2824-46c1-9686-dd666403402a",
          firstName: "Maxik",
          lastName: "Koval",
          telegramId: 453120600,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: "2024-09-16T14:03:31.000Z",
          updatedAt: "2024-09-16T14:03:31.000Z"
        },
        goalToOrganizations: [
          {
            id: "00eb152b-43a5-483d-9085-c46c23873a3d",
            createdAt: "2024-09-18T14:11:28.433Z",
            updatedAt: "2024-09-18T14:11:28.433Z"
          }
        ]
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'goalId', required: true, description: 'Id цели' })
  async findOne(@Param('userId') userId: string, @Param('goalId') goalId: string, @Ip() ip: string): Promise<GoalReadDto> {
    const goal = await this.goalService.findeOneById(goalId);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT GOAL: ${JSON.stringify(goal)} - Получить цель по ID!`);
    return goal;
  }




  @Post('new')
  @ApiOperation({ summary: 'Создать цель' })
  @ApiBody({
    description: 'ДТО для создания цели',
    type: GoalCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "f23c5846-f69d-4553-84a6-9d5f4a176e9d",
      goalName: "Стать пердуном №1",
      orderNumber: 1,
      content: "Надо перепукать шмата",
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
      createdAt: "2024-09-17T09:25:52.964Z",
      updatedAt: "2024-09-17T09:25:52.964Z"
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Body() goalCreateDto: GoalCreateDto, @Ip() ip: string): Promise<Goal> {
    const user = await this.userService.findOne(userId);
    goalCreateDto.user = user;
    goalCreateDto.account = user.account;
    const createdGoal = await this.goalService.create(goalCreateDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - goalCreateDto: ${JSON.stringify(goalCreateDto)} - Создана новая цель!`)
    return createdGoal;
  }

}