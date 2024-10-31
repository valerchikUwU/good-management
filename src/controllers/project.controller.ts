import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { use } from "passport";
import { ProjectService } from "src/application/services/project/project.service";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { TargetService } from "src/application/services/target/target.service";
import { UsersService } from "src/application/services/users/users.service";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { Type as TypeProject } from "src/domains/project.entity";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { ReadUserDto } from "src/contracts/user/read-user.dto";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { ProjectUpdateDto } from "src/contracts/project/update-project.dto";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { ProjectCreateEventDto } from "src/contracts/project/createEvent-project.dto";
import { TargetCreateEventDto } from "src/contracts/target/createEvent-target.dto";
import { State, Type as TypeTarget } from "src/domains/target.entity";
import { ProducerService } from "src/application/services/producer/producer.service";




@ApiTags('Project')
@Controller(':userId/projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService,
    private readonly userService: UsersService,
    private readonly strategyService: StrategyService,
    private readonly targetService: TargetService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
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
  async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<{ workers: ReadUserDto[], strategies: StrategyReadDto[], programs: ProjectReadDto[] }> {
    const user = await this.userService.findOne(userId);
    const workers = await this.userService.findAllForAccount(user.account);
    const strategies = await this.strategyService.findAllActiveForAccount(user.account);
    const programs = await this.projectService.findAllProgramsForAccount(user.account);
    return { workers: workers, strategies: strategies,  programs: programs }
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать политику' })
  @ApiBody({
    description: 'Данные для создания задач и проекта',
    type: ProjectCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED, description: "ОК!",
    example: "ff6c48ae-8493-48cc-9c5d-cdd1393858e6"
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Body() projectCreateDto: ProjectCreateDto, @Ip() ip: string): Promise<{id: string}> {
    const [user, organization] = await Promise.all([
      this.userService.findOne(userId),
      this.organizationService.findOneById(projectCreateDto.organizationId)
    ]);
    if (projectCreateDto.strategyId) {
      const strategy = await this.strategyService.findOneById(projectCreateDto.strategyId);
      projectCreateDto.strategy = strategy;
    }
    projectCreateDto.user = user;
    projectCreateDto.account = user.account;
    projectCreateDto.organization = organization;
    const createdProjectId = await this.projectService.create(projectCreateDto);
    const createdProject = await this.projectService.findOneById(createdProjectId);
    const targetCreateEventDtos: TargetCreateEventDto[] = [];

    if (projectCreateDto.targetCreateDtos !== undefined) {
      const createTargetsPromises = projectCreateDto.targetCreateDtos.map(async (targetCreateDto) => {
        const holderUser = await this.userService.findOne(targetCreateDto.holderUserId);
        targetCreateDto.project = createdProject;
        targetCreateDto.holderUser = holderUser;
        const createdTarget = await this.targetService.create(targetCreateDto);
        const targetCreateEventDto: TargetCreateEventDto = {
          id: createdTarget.id,
          type: targetCreateDto.type !== undefined ? targetCreateDto.type as string : TypeTarget.COMMON as string, // TypeTarget alias for Type (target)
          orderNumber: targetCreateDto.orderNumber,
          content: targetCreateDto.content,
          createdAt: new Date(),
          holderUserId: targetCreateDto.holderUserId,
          targetState: targetCreateDto.targetState !== undefined ? targetCreateDto.targetState as string : State.ACTIVE as string,
          dateStart: targetCreateDto.dateStart !== undefined ? targetCreateDto.dateStart : new Date(), //default createdAt
          deadline: targetCreateDto.deadline !== undefined ? targetCreateDto.deadline : null,
          projectId: createdProject.id 
        }
        targetCreateEventDtos.push(targetCreateEventDto);
        return createdTarget;
      });
      await Promise.all(createTargetsPromises);
    }
    const createdEventProjectDto: ProjectCreateEventDto = {
      eventType: 'PROJECT_CREATED',
      id: createdProject.id,
      projectName: projectCreateDto.projectName,
      programId: projectCreateDto.programId !== undefined ? projectCreateDto.programId : null,
      content: projectCreateDto.content !== undefined ? projectCreateDto.content : null,
      type: projectCreateDto.type !== undefined ? projectCreateDto.type as string : TypeProject.PROJECT as string, // TypeProject alias for Type (project)
      organizationId: projectCreateDto.organizationId,
      createdAt: new Date(),
      strategyId: projectCreateDto.strategyId !== undefined ? projectCreateDto.strategyId : null,
      accountId: user.account.id,
      userId: user.id,
      targetCreateDtos: targetCreateEventDtos.length > 0 ? targetCreateEventDtos : null //nullable
    };
    await this.producerService.sendCreatedProjectToQueue(createdEventProjectDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - projectCreateDto: ${JSON.stringify(projectCreateDto)} - Создан новый проект!`)
    return {id: createdProjectId};
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
    example: "ff6c48ae-8493-48cc-9c5d-cdd1393858e6"
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Проект не найден!` })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'projectId', required: true, description: 'Id проекта' })
  async update(@Param('projectId') projectId: string, @Body() projectUpdateDto: ProjectUpdateDto, @Ip() ip: string): Promise<{id: string}> {
    if(projectUpdateDto.organizationId){
      const organization = await this.organizationService.findOneById(projectUpdateDto.organizationId);
      projectUpdateDto.organization = organization;
    }
    const updatedProjectId = await this.projectService.update(projectId, projectUpdateDto);
    const project = await this.projectService.findOneById(updatedProjectId);
    if (projectUpdateDto.targetUpdateDtos !== undefined) {
      const updateTargetsPromises = projectUpdateDto.targetUpdateDtos.map(async (targetUpdateDto) => {
        const holderUser = await this.userService.findOne(targetUpdateDto.holderUserId);
        targetUpdateDto.holderUser = holderUser;
        return await this.targetService.update(targetUpdateDto);
      });
      await Promise.all(updateTargetsPromises); // Ждём выполнения всех операций update
    }

    if (projectUpdateDto.targetCreateDtos !== undefined) {
      const createTargetsPromises = projectUpdateDto.targetCreateDtos.map(async (targetCreateDto) => {
        targetCreateDto.project = project; // Присваиваем обновленный проект
        const holderUser = await this.userService.findOne(targetCreateDto.holderUserId);
        targetCreateDto.holderUser = holderUser;
        return await this.targetService.create(targetCreateDto); // Возвращаем промис создания
      });
      await Promise.all(createTargetsPromises); // Ждём выполнения всех операций create
    }


    this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED PROJECT: ${JSON.stringify(projectUpdateDto)} - Проект успешно обновлен!`);
    return {id: updatedProjectId};
  }


  @Get(':projectId')
  @ApiOperation({ summary: 'Вернуть проект по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "31a2c203-17bf-41be-a8db-92f747700a4c",
      projectNumber: 97,
      programId: null,
      programNumber: null,
      content: "Контент проекта",
      type: "Проект",
      createdAt: "2024-10-28T12:30:37.771Z",
      updatedAt: "2024-10-28T12:30:37.771Z",
      organization: {
        id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
        organizationName: "soplya firma",
        parentOrganizationId: null,
        createdAt: "2024-09-16T14:24:33.841Z",
        updatedAt: "2024-09-16T14:24:33.841Z"
      },
      targets: [
        {
          id: "3e01eb60-b4d8-4ad7-adb7-473a82df44bc",
          type: "Обычная",
          orderNumber: 3,
          content: "Контент задачи",
          holderUserId: "702dc852-4806-47b7-8b03-1214ef428efd",
          dateStart: "2024-10-28T12:30:37.699Z",
          deadline: "2024-09-18T14:59:47.010Z",
          dateComplete: null,
          createdAt: "2024-10-28T12:30:37.997Z",
          updatedAt: "2024-10-28T12:30:37.997Z",
          targetHolders: [
            {
              id: "382343fd-c5b2-4be8-9fa6-d30ae0540a3f",
              createdAt: "2024-10-28T12:30:38.093Z",
              updatedAt: "2024-10-28T12:30:38.093Z",
              user: {
                id: "702dc852-4806-47b7-8b03-1214ef428efd",
                firstName: "Валерий",
                lastName: "Лысенко",
                middleName: null,
                telegramId: 803348257,
                telephoneNumber: "+79787512027",
                avatar_url: null,
                vk_id: null,
                createdAt: "2024-09-30T14:10:48.302Z",
                updatedAt: "2024-10-09T09:27:30.811Z"
              }
            }
          ]
        }
      ],
      "strategy": {
        "id": "fbc2871c-37b3-435f-8b9a-d30235e59e33",
        "strategyNumber": 71,
        "dateActive": null,
        "content": "HTML текст",
        "state": "Черновик",
        "createdAt": "2024-10-28T12:09:02.936Z",
        "updatedAt": "2024-10-28T12:09:02.936Z"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'projectId', required: true, description: 'Id проекта' })
  async findOne(@Param('userId') userId: string, @Param('projectId') projectId: string): Promise<ProjectReadDto> {
    return await this.projectService.findOneById(projectId);
  }
}