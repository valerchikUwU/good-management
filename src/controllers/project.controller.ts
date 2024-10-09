import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { use } from "passport";
import { ProjectService } from "src/application/services/project/project.service";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { TargetService } from "src/application/services/target/target.service";
import { UsersService } from "src/application/services/users/users.service";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { TargetCreateDto } from "src/contracts/target/create-target.dto";
import { TargetHolderCreateDto } from "src/contracts/targetHolder/create-targetHolder.dto";
import { Project } from "src/domains/project.entity";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { ReadUserDto } from "src/contracts/user/read-user.dto";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { PolicyUpdateDto } from "src/contracts/policy/update-policy.dto";
import { ProjectUpdateDto } from "src/contracts/project/update-project.dto";
import { TargetUpdateDto } from "src/contracts/target/update-target.dto";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";




@ApiTags('Project')
@Controller(':userId/projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService,
    private readonly userService: UsersService,
    private readonly strategyService: StrategyService,
    private readonly targetService: TargetService,
    private readonly organizationService: OrganizationService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Все проекты' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example:
      [
        {
          id: "f2c217bc-367b-4d72-99c3-37d725306786",
          projectNumber: 3,
          programId: null,
          content: "Контент политики",
          type: "Проект",
          createdAt: "2024-09-20T14:44:43.910Z",
          updatedAt: "2024-09-20T14:44:43.910Z"
        },
        {
          id: "41ed9165-9106-4fc8-94aa-cc7292bb1741",
          projectNumber: 4,
          programId: null,
          content: "Контент проекта",
          type: "Проект",
          createdAt: "2024-09-20T14:45:33.741Z",
          updatedAt: "2024-09-20T14:45:33.741Z"
        },
      ]
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async findAll(@Param('userId') userId: string): Promise<ProjectReadDto[]> {
    const user = await this.userService.findOne(userId)
    return await this.projectService.findAllForAccount(user.account)
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания нового проекта' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      workers: [
        {
          id: "3b809c42-2824-46c1-9686-dd666403402a",
          firstName: "Maxik",
          lastName: "Koval",
          telegramId: 453120600,
          telephoneNumber: null,
          avatar_url: "https://sun1-98.userapi.com/s/v1/ig2/dcjf3yMOOjHp5QM1hqZL_ZJj2z9cHsM2f0Xcv7AMH0WoifdFkLn8U7w5SFtY6tUP8pQrW-Gs8gXdcztvuy7DNDaS.jpg?quality=95&crop=253,160,669,669&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640&ava=1&cs=50x50",
          vk_id: 175696487,
          createdAt: "2024-09-16T14:03:31.000Z",
          updatedAt: "2024-10-09T09:25:39.735Z"
        }
      ],
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
      ],
      programsWithoutProject: [
        {
          id: "e60b25a2-f01a-49f5-a55e-994bc5987010",
          projectNumber: 13,
          programId: "b6ed2664-9510-4a47-9117-6ce89903b4b5",
          content: "Контент проекта",
          type: "Программа",
          createdAt: "2024-10-09T12:31:01.634Z",
          updatedAt: "2024-10-09T12:31:01.634Z"
        }
      ]
    }

  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<{ workers: ReadUserDto[], strategies: StrategyReadDto[], organizations: OrganizationReadDto[], programsWithoutProject: ProjectReadDto[] }> {
    const user = await this.userService.findOne(userId);
    const workers = await this.userService.findAllForAccount(user.account);
    const strategies = await this.strategyService.findAllActiveForAccount(user.account);
    const organizations = await this.organizationService.findAllForAccount(user.account);
    const programs = await this.projectService.findAllProgramsWithoutProjectForAccount(user.account);
    return { workers: workers, strategies: strategies, organizations: organizations, programsWithoutProject: programs }
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать политику' })
  @ApiBody({
    description: 'Данные для создания задач и проекта',
    type: ProjectCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      programId: null,
      content: "Контент проекта",
      type: "Проект",
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
      strategy: {
        id: "21dcf96d-1e6a-4c8c-bc12-c90589b40e93",
        strategyNumber: 2,
        dateActive: null,
        content: "HTML текст",
        state: "Черновик",
        createdAt: "2024-09-20T14:35:56.273Z",
        updatedAt: "2024-09-20T14:35:56.273Z"
      },
      id: "ff6c48ae-8493-48cc-9c5d-cdd1393858e6",
      projectNumber: 5,
      createdAt: "2024-09-20T14:45:41.103Z",
      updatedAt: "2024-09-20T14:45:41.103Z"
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Body() projectCreateDto: ProjectCreateDto): Promise<Project> {
    const user = await this.userService.findOne(userId);
    const strategy = await this.strategyService.findOneById(projectCreateDto.strategyId);
    projectCreateDto.user = user;
    projectCreateDto.account = user.account;
    projectCreateDto.strategy = strategy;
    const createdProject = await this.projectService.create(projectCreateDto);
    if (projectCreateDto.targetCreateDtos !== undefined) {
      console.log('asdasdasd')
      const createTargetsPromises = projectCreateDto.targetCreateDtos.map(async (targetCreateDto) => {
        targetCreateDto.project = createdProject;
        const holderUser = await this.userService.findOne(targetCreateDto.holderUserId);
        targetCreateDto.holderUser = holderUser;
        return this.targetService.create(targetCreateDto);
      });
    await Promise.all(createTargetsPromises);
    }
    return createdProject;
  }

  @Patch(':projectId/update')
  @ApiOperation({ summary: 'Обновить проект по Id' })
  @ApiBody({
    description: 'ДТО для обновления проекта',
    type: ProjectUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "ff6c48ae-8493-48cc-9c5d-cdd1393858e6",
      projectNumber: 5,
      programId: null,
      content: "ОБНОВА ОБНОВА",
      type: "Проект",
      createdAt: "2024-09-20T14:45:41.103Z",
      updatedAt: "2024-09-27T11:29:27.491Z"
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Проект не найден!` })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'projectId', required: true, description: 'Id проекта' })
  async update(@Param('projectId') projectId: string, @Body() projectUpdateDto: ProjectUpdateDto, @Ip() ip: string): Promise<ProjectReadDto> {
    const updatedProject = await this.projectService.update(projectId, projectUpdateDto);
    const updateTargetsPromises = projectUpdateDto.targetUpdateDtos.map(async (targetUpdateDto) => {
      return this.targetService.update(targetUpdateDto);
    });

    await Promise.all(updateTargetsPromises); // Ждём выполнения всех операций update
    const createTargetsPromises = projectUpdateDto.targetCreateDtos.map(async (targetCreateDto) => {
      targetCreateDto.project = updatedProject; // Присваиваем обновленный проект
      return this.targetService.create(targetCreateDto); // Возвращаем промис создания
    });

    await Promise.all(createTargetsPromises); // Ждём выполнения всех операций create
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED PROJECT: ${JSON.stringify(projectUpdateDto)} - Проект успешно обновлен!`);
    return updatedProject;
  }


  @Get(':projectId')
  @ApiOperation({ summary: 'Вернуть проект по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "f2c217bc-367b-4d72-99c3-37d725306786",
      projectNumber: 15,
      programId: null,
      content: "Контент политики",
      type: "Проект",
      createdAt: "2024-10-09T12:32:25.762Z",
      updatedAt: "2024-10-09T12:32:25.762Z",
      projectToOrganizations: [
        {
          id: "6d1b65ae-d7fd-4eb2-8188-ede120948abd",
          createdAt: "2024-09-20T14:44:44.499Z",
          updatedAt: "2024-09-20T14:44:44.499Z",
          organization: {
            id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
            organizationName: "soplya firma",
            parentOrganizationId: null,
            createdAt: "2024-09-16T14:24:33.841Z",
            updatedAt: "2024-09-16T14:24:33.841Z"
          }
        }
      ],
      targets: [
        {
          id: "7a269e8f-26ba-46da-9ef9-e1b17475b6d9",
          type: "Продукт",
          commonNumber: null,
          statisticNumber: null,
          ruleNumber: null,
          productNumber: 1,
          content: "Контент задачи",
          dateStart: "2024-09-20T14:44:44.274Z",
          deadline: "2024-09-27T14:59:47.010Z",
          dateComplete: null,
          createdAt: "2024-09-20T14:44:44.980Z",
          updatedAt: "2024-09-20T14:44:44.980Z"
        }
      ]
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'projectId', required: true, description: 'Id пользователя' })
  async findOne(@Param('userId') userId: string, @Param('projectId') projectId: string): Promise<ProjectReadDto> {
    return await this.projectService.findeOneById(projectId);
  }
}