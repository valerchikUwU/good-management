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
import { TargetUpdateEventDto } from "src/contracts/target/updateEvent-target.dto";
import { ProjectUpdateEventDto } from "src/contracts/project/updateEvent-project.dto";




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
          id: "a76caf62-bc78-44e9-ba64-6e8e4c5b3248",
          firstName: "Илюха",
          lastName: "Белописькин",
          middleName: null,
          telegramId: 0,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: "2024-10-03T12:53:00.698Z",
          updatedAt: "2024-10-09T09:36:58.656Z"
        }
      ],
      strategies: [
        {
          id: "a21ce28a-72ab-472e-a53d-cbd1f69d619a",
          strategyNumber: 100,
          dateActive: null,
          content: "<p>1111</p>\n",
          state: "Черновик",
          createdAt: "2024-10-31T08:44:57.466Z",
          updatedAt: "2024-10-31T08:44:57.466Z",
          organization: {
            id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
            organizationName: "soplya firma",
            parentOrganizationId: null,
            createdAt: "2024-09-16T14:24:33.841Z",
            updatedAt: "2024-09-16T14:24:33.841Z"
          }
        }
      ],
      programs: [
        {
          id: "b7f4064f-cddf-4faa-b0fb-4601c6c77418",
          projectNumber: 100,
          projectName: "Название проекта",
          programId: null,
          content: null,
          type: "Программа",
          createdAt: "2024-10-29T15:16:25.171Z",
          updatedAt: "2024-10-29T15:16:25.171Z"
        }
      ],
      organizations: [
        {
          id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
          organizationName: "soplya firma",
          parentOrganizationId: null,
          createdAt: "2024-09-16T14:24:33.841Z",
          updatedAt: "2024-09-16T14:24:33.841Z"
        }
      ]
    }

  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<{ workers: ReadUserDto[], strategies: StrategyReadDto[], programs: ProjectReadDto[], organizations: OrganizationReadDto[]}> {
    const user = await this.userService.findOne(userId);
    const workers = await this.userService.findAllForAccount(user.account);
    const strategies = await this.strategyService.findAllActiveForAccount(user.account);
    const programs = await this.projectService.findAllProgramsForAccount(user.account);
    const organizations = await this.organizationService.findAllForAccount(user.account, false);
    return { workers: workers, strategies: strategies,  programs: programs, organizations: organizations }
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
          projectId: createdProject.id,
          accountId: user.account.id
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
  async update(@Param('userId') userId: string, @Param('projectId') projectId: string, @Body() projectUpdateDto: ProjectUpdateDto, @Ip() ip: string): Promise<{id: string}> {
    const user = await this.userService.findOne(userId);
    if(projectUpdateDto.organizationId){
      const organization = await this.organizationService.findOneById(projectUpdateDto.organizationId);
      projectUpdateDto.organization = organization;
    }
    if(projectUpdateDto.strategyId){
      const strategy = await this.strategyService.findOneById(projectUpdateDto.strategyId);
      projectUpdateDto.strategy = strategy;
    }
    const updatedProjectId = await this.projectService.update(projectId, projectUpdateDto);
    const project = await this.projectService.findOneById(updatedProjectId);


    const targetCreateEventDtos: TargetCreateEventDto[] = [];
    const targetUpdateEventDtos: TargetUpdateEventDto[] = [];
    if (projectUpdateDto.targetUpdateDtos !== undefined) {
      const updateTargetsPromises = projectUpdateDto.targetUpdateDtos.map(async (targetUpdateDto) => {
        const holderUser = await this.userService.findOne(targetUpdateDto.holderUserId);
        targetUpdateDto.holderUser = holderUser;
        const updatedTargetId = await this.targetService.update(targetUpdateDto);
        const targetUpdateEventDto: TargetUpdateEventDto = {
          id: updatedTargetId,
          orderNumber: targetUpdateDto.orderNumber !== undefined ? targetUpdateDto.orderNumber : null,
          content: targetUpdateDto.content !== undefined ? targetUpdateDto.content : null,
          updatedAt: new Date(),
          holderUserId: targetUpdateDto.holderUserId !== undefined ? targetUpdateDto.holderUserId : null,
          targetState: targetUpdateDto.targetState !== undefined ? targetUpdateDto.targetState as string : null,
          dateStart: targetUpdateDto.dateStart !== undefined ? targetUpdateDto.dateStart : null, 
          deadline: targetUpdateDto.deadline !== undefined ? targetUpdateDto.deadline : null,
          projectId: project.id,
          accountId: user.account.id
        }
        targetUpdateEventDtos.push(targetUpdateEventDto);
        return updatedTargetId;
      });
      await Promise.all(updateTargetsPromises); // Ждём выполнения всех операций update
    }

    if (projectUpdateDto.targetCreateDtos !== undefined) {
      const createTargetsPromises = projectUpdateDto.targetCreateDtos.map(async (targetCreateDto) => {
        targetCreateDto.project = project; // Присваиваем обновленный проект
        const holderUser = await this.userService.findOne(targetCreateDto.holderUserId);
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
          projectId: project.id,
          accountId: user.account.id
        }
        targetCreateEventDtos.push(targetCreateEventDto);
        return createdTarget;
      });
      await Promise.all(createTargetsPromises); // Ждём выполнения всех операций create
    }

    const updatedEventProjectDto: ProjectUpdateEventDto = {
      eventType: 'PROJECT_UPDATED',
      id: project.id,
      projectName: projectUpdateDto.projectName !== undefined ? projectUpdateDto.projectName : null,
      programId: projectUpdateDto.programId !== undefined ? projectUpdateDto.programId : null,
      content: projectUpdateDto.content !== undefined ? projectUpdateDto.content : null,
      type: projectUpdateDto.type !== undefined ? projectUpdateDto.type as string : null,
      organizationId: projectUpdateDto.organizationId !== undefined ? projectUpdateDto.organizationId : null,
      updatedAt: new Date(),
      strategyId: projectUpdateDto.strategyId !== undefined ? projectUpdateDto.strategyId : null,
      accountId: user.account.id,
      targetUpdateDtos: targetUpdateEventDtos.length > 0 ? targetUpdateEventDtos : null,
      targetCreateDtos: targetCreateEventDtos.length > 0 ? targetCreateEventDtos : null
    };
    await this.producerService.sendUpdatedProjectToQueue(updatedEventProjectDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED PROJECT: ${JSON.stringify(projectUpdateDto)} - Проект успешно обновлен!`);
    return {id: updatedProjectId};
  }


  @Get(':programId/program')
  @ApiOperation({ summary: 'Вернуть программу по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'programId', required: true, description: 'Id программы' })
  async findOneProgram(@Param('userId') userId: string, @Param('programId') programId: string): Promise<{program: ProjectReadDto, projects: ProjectReadDto[]}> {
    const programWithProjects = await this.projectService.findOneProgramById(programId);
    return {program: programWithProjects.program, projects: programWithProjects.projects}
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
      strategy: {
        id: "fbc2871c-37b3-435f-8b9a-d30235e59e33",
        strategyNumber: 71,
        dateActive: null,
        content: "HTML текст",
        state: "Черновик",
        createdAt: "2024-10-28T12:09:02.936Z",
        updatedAt: "2024-10-28T12:09:02.936Z"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'projectId', required: true, description: 'Id проекта' })
  async findOne(@Param('userId') userId: string, @Param('projectId') projectId: string): Promise<{project: ProjectReadDto, strategies: StrategyReadDto[]}> {
    const [user, project] = await Promise.all([
      this.userService.findOne(userId),
      this.projectService.findOneById(projectId)
    ])
    const strategies = await this.strategyService.findAllForAccount(user.account)
    return {project: project, strategies: strategies}
  }
}