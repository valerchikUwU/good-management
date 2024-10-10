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
        id: "1997ef07-7b59-4496-b91d-be440468f9be",
        content: [
          "Контент цели",
          "one more content"
        ],
        createdAt: "2024-10-10T15:22:39.611Z",
        updatedAt: "2024-10-10T15:22:39.611Z",
        organization: {
          id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
          organizationName: "soplya firma",
          parentOrganizationId: null,
          createdAt: "2024-09-16T14:24:33.841Z",
          updatedAt: "2024-09-16T14:24:33.841Z"
        }
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
          updatedAt: "2024-09-16T14:24:33.841Z",
          goal: {
            id: "1997ef07-7b59-4496-b91d-be440468f9be",
            content: [
              "Новый контент",
              "updated"
            ],
            createdAt: "2024-10-10T15:22:39.611Z",
            updatedAt: "2024-10-10T15:26:17.301Z"
          }
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
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "1997ef07-7b59-4496-b91d-be440468f9be",
      content: [
        "Новый контент",
        "updated"
      ],
      createdAt: "2024-10-10T15:22:39.611Z",
      updatedAt: "2024-10-10T15:26:17.301Z"
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Цель не найдена!" })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'goalId', required: true, description: 'Id цели' })
  async update(@Param('userId') userId: string, @Param('goalId') goalId: string, @Body() goalUpdateDto: GoalUpdateDto, @Ip() ip: string): Promise<GoalReadDto> {
    const updatedGoal = await this.goalService.update(goalId, goalUpdateDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED GOAL: ${JSON.stringify(goalUpdateDto)} - Цель успешно обновлена!`);
    return updatedGoal;
  }

  @Get(':goalId')
  @ApiOperation({ summary: 'Получить цель по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      currentGoal: {
        id: "1997ef07-7b59-4496-b91d-be440468f9be",
        content: [
          "Контент цели",
          "one more content"
        ],
        createdAt: "2024-10-10T15:22:39.611Z",
        updatedAt: "2024-10-10T15:22:39.611Z",
        organization: {
          id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
          organizationName: "soplya firma",
          parentOrganizationId: null,
          createdAt: "2024-09-16T14:24:33.841Z",
          updatedAt: "2024-09-16T14:24:33.841Z"
        }
      },
      organizations: [
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
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'goalId', required: true, description: 'Id цели' })
  async findOne(@Param('userId') userId: string, @Param('goalId') goalId: string, @Ip() ip: string): Promise<{ currentGoal: GoalReadDto, organizations: OrganizationReadDto[]}> {
    const user = await this.userService.findOne(userId)
    const goal = await this.goalService.findOneById(goalId);
    const organizations = await this.organizationService.findAllForAccount(user.account);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT GOAL: ${JSON.stringify(goal)} - Получить цель по ID!`);
    return {currentGoal: goal, organizations: organizations};
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
      id: "da1787cb-a79a-4663-8232-c13cacfdb953",
      content: [
        "Контент цели",
        "one more content"
      ],
      createdAt: "2024-09-26T14:47:03.569Z",
      updatedAt: "2024-09-26T14:47:03.569Z"
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Ошибка валидации!" })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Body() goalCreateDto: GoalCreateDto, @Ip() ip: string): Promise<GoalReadDto> {
    const user = await this.userService.findOne(userId);
    const organization = await this.organizationService.findOneById(goalCreateDto.organizationId)
    goalCreateDto.user = user;
    goalCreateDto.account = user.account;
    goalCreateDto.organization = organization;
    const createdGoal = await this.goalService.create(goalCreateDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - goalCreateDto: ${JSON.stringify(goalCreateDto)} - Создана новая цель!`)
    return createdGoal;
  }

}