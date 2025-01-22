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

import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { use } from 'passport';
import { ProjectService } from 'src/application/services/project/project.service';
import { StrategyService } from 'src/application/services/strategy/strategy.service';
import { TargetService } from 'src/application/services/target/target.service';
import { ProjectCreateDto } from 'src/contracts/project/create-project.dto';
import { ProjectReadDto } from 'src/contracts/project/read-project.dto';
import { Type as TypeProject } from 'src/domains/project.entity';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { ProjectUpdateDto } from 'src/contracts/project/update-project.dto';
import { StrategyReadDto } from 'src/contracts/strategy/read-strategy.dto';
import { ProjectCreateEventDto } from 'src/contracts/project/createEvent-project.dto';
import { TargetCreateEventDto } from 'src/contracts/target/createEvent-target.dto';
import { State, Type as TypeTarget } from 'src/domains/target.entity';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { TargetUpdateEventDto } from 'src/contracts/target/updateEvent-target.dto';
import { ProjectUpdateEventDto } from 'src/contracts/project/updateEvent-project.dto';
import { TimeoutError } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PostService } from 'src/application/services/post/post.service';
import { PostReadDto } from 'src/contracts/post/read-post.dto';

@ApiTags('Project')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly postService: PostService,
    private readonly strategyService: StrategyService,
    private readonly targetService: TargetService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get(':organizationId/projects')
  @ApiOperation({ summary: 'Все проекты в организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        "id": "26cc6162-8c3d-440f-8464-67561172bc32",
        "projectNumber": 280,
        "projectName": "НОвый",
        "programId": null,
        "content": "Контент проекта",
        "type": "Проект",
        "createdAt": "2024-12-20T12:21:09.823Z",
        "updatedAt": "2024-12-20T12:21:09.823Z",
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
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  async findAll(
    @Param('organizationId') organizationId: string,
  ): Promise<ProjectReadDto[]> {
    return await this.projectService.findAllForOrganization(organizationId);
  }

  @Get(':organizationId/program/new')
  @ApiOperation({ summary: 'Получить данные для создания новой программы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "workers": [
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
      ],
      "strategies": [
        {
          "id": "c970f786-b785-49da-894c-b9c975ec0e26",
          "strategyNumber": 194,
          "dateActive": null,
          "content": "HTML текст",
          "state": "Черновик",
          "createdAt": "2024-12-20T12:15:04.395Z",
          "updatedAt": "2024-12-20T12:15:04.395Z"
        }
      ],
      "projects": [
        {
          "id": "26cc6162-8c3d-440f-8464-67561172bc32",
          "projectNumber": 280,
          "projectName": "НОвый",
          "programId": null,
          "content": "Контент проекта",
          "type": "Проект",
          "createdAt": "2024-12-20T12:21:09.823Z",
          "updatedAt": "2024-12-20T12:21:09.823Z",
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
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  async beforeCreateProgram(
    @Param('organizationId') organizationId: string,
  ): Promise<{
    posts: PostReadDto[];
    strategies: StrategyReadDto[];
    projects: ProjectReadDto[];
  }> {
    const posts = await this.postService.findAllWithUserForOrganization(organizationId, ['user']);
    const strategies = await this.strategyService.findAllActiveForOrganization(organizationId);
    const projects = await this.projectService.findAllProjectsWithoutProgramForOrganization(organizationId, ['targets']);
    return {
      posts: posts,
      strategies: strategies,
      projects: projects,
    };
  }

  @Get(':organizationId/new')
  @ApiOperation({ summary: 'Получить данные для создания нового проекта' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "workers": [
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
      ],
      "strategies": [
        {
          "id": "c970f786-b785-49da-894c-b9c975ec0e26",
          "strategyNumber": 194,
          "dateActive": null,
          "content": "HTML текст",
          "state": "Черновик",
          "createdAt": "2024-12-20T12:15:04.395Z",
          "updatedAt": "2024-12-20T12:15:04.395Z"
        }
      ],
      "programs": [
        {
          "id": "3b6e9455-7435-4f6b-bef4-950d40aca37d",
          "projectNumber": 281,
          "projectName": "Программа",
          "programId": null,
          "content": "Контент проекта",
          "type": "Программа",
          "createdAt": "2024-12-20T12:25:21.715Z",
          "updatedAt": "2024-12-20T12:25:21.715Z",
          "strategy": {
            "id": "c970f786-b785-49da-894c-b9c975ec0e26",
            "strategyNumber": 194,
            "dateActive": null,
            "content": "HTML текст",
            "state": "Черновик",
            "createdAt": "2024-12-20T12:15:04.395Z",
            "updatedAt": "2024-12-20T12:15:04.395Z"
          }
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
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  async beforeCreate(
    @Param('organizationId') organizationId: string,
  ): Promise<{
    posts: PostReadDto[];
    strategies: StrategyReadDto[];
    programs: ProjectReadDto[];
  }> {
    const posts = await this.postService.findAllWithUserForOrganization(organizationId, ['user']);
    const strategies = await this.strategyService.findAllActiveForOrganization(organizationId);
    const programs = await this.projectService.findAllProgramsForOrganization(organizationId, ['strategy']);
    return {
      posts: posts,
      strategies: strategies,
      programs: programs,
    };
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать проект' })
  @ApiBody({
    description: 'Данные для создания задач и проекта',
    type: ProjectCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: {"id": "ff6c48ae-8493-48cc-9c5d-cdd1393858e6"},
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async create(
    @Req() req: ExpressRequest,
    @Body() projectCreateDto: ProjectCreateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const organization = await this.organizationService.findOneById(projectCreateDto.organizationId);
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
      const createTargetsPromises = projectCreateDto.targetCreateDtos.map(
        async (targetCreateDto) => {
          const holderPost = await this.postService.findOneById(targetCreateDto.holderPostId);
          targetCreateDto.project = createdProject;
          targetCreateDto.holderPost = holderPost;
          const createdTarget = await this.targetService.create(targetCreateDto);
          const targetCreateEventDto: TargetCreateEventDto = {
            id: createdTarget.id,
            type:
              targetCreateDto.type !== undefined
                ? (targetCreateDto.type as string)
                : (TypeTarget.COMMON as string), // TypeTarget alias for Type (target)
            orderNumber: targetCreateDto.orderNumber,
            content: targetCreateDto.content,
            createdAt: new Date(),
            holderPostId: targetCreateDto.holderPostId,
            targetState: State.ACTIVE as string,
            dateStart:
              targetCreateDto.dateStart !== undefined
                ? targetCreateDto.dateStart
                : new Date(),
            deadline:
              targetCreateDto.deadline !== undefined
                ? targetCreateDto.deadline
                : null,
            projectId: createdProject.id,
            accountId: user.account.id,
          };
          targetCreateEventDtos.push(targetCreateEventDto);
          return createdTarget;
        },
      );
      await Promise.all(createTargetsPromises);
    }
    const createdEventProjectDto: ProjectCreateEventDto = {
      eventType: 'PROJECT_CREATED',
      id: createdProject.id,
      projectName: projectCreateDto.projectName,
      programId:
        projectCreateDto.programId !== undefined
          ? projectCreateDto.programId
          : null,
      content:
        projectCreateDto.content !== undefined
          ? projectCreateDto.content
          : null,
      type:
        projectCreateDto.type !== undefined
          ? (projectCreateDto.type as string)
          : (TypeProject.PROJECT as string), // TypeProject alias for Type (project)
      organizationId: projectCreateDto.organizationId,
      createdAt: new Date(),
      strategyId:
        projectCreateDto.strategyId !== undefined
          ? projectCreateDto.strategyId
          : null,
      accountId: user.account.id,
      userId: user.id,
      targetCreateDtos:
        targetCreateEventDtos.length > 0 ? targetCreateEventDtos : null,
    };
    // try {
    //   await Promise.race([
    //     this.producerService.sendCreatedProjectToQueue(createdEventProjectDto),
    //     new Promise((_, reject) =>
    //       setTimeout(() => reject(new TimeoutError()), 5000),
    //     ),
    //   ]);
    // } catch (error) {
    //   if (error instanceof TimeoutError) {
    //     this.logger.error(
    //       `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
    //     );
    //   } else {
    //     this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
    //   }
    // }
    this.logger.info(
      `${yellow('OK!')} - projectCreateDto: ${JSON.stringify(projectCreateDto)} - Создан новый проект!`,
    );
    return { id: createdProjectId };
  }

  @Patch(':projectId/update')
  @ApiOperation({ summary: 'Обновить проект по Id' })
  @ApiBody({
    description: 'ДТО для обновления проекта',
    type: ProjectUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: 'ff6c48ae-8493-48cc-9c5d-cdd1393858e6',
    },
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
    description: `Проект не найден!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ name: 'projectId', required: true, description: 'Id проекта' })
  async update(
    @Req() req: ExpressRequest,
    @Param('projectId') projectId: string,
    @Body() projectUpdateDto: ProjectUpdateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const promises: Promise<void>[] = [];    // Условно добавляем запросы в массив промисов
    console.log(projectUpdateDto.strategyId)
    if (projectUpdateDto.strategyId != null) {
      promises.push(
        this.strategyService.findOneById(projectUpdateDto.strategyId).then(strategy => {
          projectUpdateDto.strategy = strategy;
        }),
      );
    }

    // Выполняем все запросы параллельно
    await Promise.all(promises);


    const updatedProjectId = await this.projectService.update(
      projectId,
      projectUpdateDto,
    );
    const project = await this.projectService.findOneById(updatedProjectId);

    const targetCreateEventDtos: TargetCreateEventDto[] = [];
    const targetUpdateEventDtos: TargetUpdateEventDto[] = [];
    if (projectUpdateDto.targetUpdateDtos !== undefined) {
      const updateTargetsPromises = projectUpdateDto.targetUpdateDtos.map(
        async (targetUpdateDto) => {
          if (targetUpdateDto.holderPostId) {
            const holderPost = await this.postService.findOneById(targetUpdateDto.holderPostId);
            targetUpdateDto.holderPost = holderPost;
          }
          const updatedTargetId = await this.targetService.update(targetUpdateDto);
          const targetUpdateEventDto: TargetUpdateEventDto = {
            id: updatedTargetId,
            orderNumber:
              targetUpdateDto.orderNumber !== undefined
                ? targetUpdateDto.orderNumber
                : null,
            content:
              targetUpdateDto.content !== undefined
                ? targetUpdateDto.content
                : null,
            updatedAt: new Date(),
            holderPostId:
              targetUpdateDto.holderPostId !== undefined
                ? targetUpdateDto.holderPostId
                : null,
            targetState:
              targetUpdateDto.targetState !== undefined
                ? (targetUpdateDto.targetState as string)
                : null,
            dateStart:
              targetUpdateDto.dateStart !== undefined
                ? targetUpdateDto.dateStart
                : null,
            deadline:
              targetUpdateDto.deadline !== undefined
                ? targetUpdateDto.deadline
                : null,
            projectId: project.id,
            accountId: user.account.id,
          };
          targetUpdateEventDtos.push(targetUpdateEventDto);
          return updatedTargetId;
        },
      );
      await Promise.all(updateTargetsPromises);
    }

    if (projectUpdateDto.targetCreateDtos !== undefined) {
      const createTargetsPromises = projectUpdateDto.targetCreateDtos.map(
        async (targetCreateDto) => {
          targetCreateDto.project = project; // Присваиваем обновленный проект
          const holderPost = await this.postService.findOneById(targetCreateDto.holderPostId);
          targetCreateDto.holderPost = holderPost;
          const createdTarget = await this.targetService.create(targetCreateDto);
          const targetCreateEventDto: TargetCreateEventDto = {
            id: createdTarget.id,
            type:
              targetCreateDto.type !== undefined
                ? (targetCreateDto.type as string)
                : (TypeTarget.COMMON as string), // TypeTarget alias for Type (target)
            orderNumber: targetCreateDto.orderNumber,
            content: targetCreateDto.content,
            createdAt: new Date(),
            holderPostId: targetCreateDto.holderPostId,
            targetState: State.ACTIVE as string,
            dateStart:
              targetCreateDto.dateStart !== undefined
                ? targetCreateDto.dateStart
                : new Date(),
            deadline:
              targetCreateDto.deadline !== undefined
                ? targetCreateDto.deadline
                : null,
            projectId: project.id,
            accountId: user.account.id,
          };
          targetCreateEventDtos.push(targetCreateEventDto);
          return createdTarget;
        },
      );
      await Promise.all(createTargetsPromises);
    }

    const updatedEventProjectDto: ProjectUpdateEventDto = {
      eventType: 'PROJECT_UPDATED',
      id: project.id,
      projectName:
        projectUpdateDto.projectName !== undefined
          ? projectUpdateDto.projectName
          : null,
      programId:
        projectUpdateDto.programId !== undefined
          ? projectUpdateDto.programId
          : null,
      content:
        projectUpdateDto.content !== undefined
          ? projectUpdateDto.content
          : null,
      type:
        projectUpdateDto.type !== undefined
          ? (projectUpdateDto.type as string)
          : null,
      updatedAt: new Date(),
      strategyId:
        projectUpdateDto.strategyId !== undefined
          ? projectUpdateDto.strategyId
          : null,
      accountId: user.account.id,
      targetUpdateDtos:
        targetUpdateEventDtos.length > 0 ? targetUpdateEventDtos : null,
      targetCreateDtos:
        targetCreateEventDtos.length > 0 ? targetCreateEventDtos : null,
    };
    // try {
    //   await Promise.race([
    //     this.producerService.sendUpdatedProjectToQueue(updatedEventProjectDto),
    //     new Promise((_, reject) =>
    //       setTimeout(() => reject(new TimeoutError()), 5000),
    //     ),
    //   ]);
    // } catch (error) {
    //   if (error instanceof TimeoutError) {
    //     this.logger.error(
    //       `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
    //     );
    //   } else {
    //     this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
    //   }
    // }
    this.logger.info(
      `${yellow('OK!')} - UPDATED PROJECT: ${JSON.stringify(projectUpdateDto)} - Проект успешно обновлен!`,
    );
    return { id: updatedProjectId };
  }

  @Get(':programId/program')
  @ApiOperation({ summary: 'Вернуть программу по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "program": {
        "id": "3b6e9455-7435-4f6b-bef4-950d40aca37d",
        "projectNumber": 281,
        "projectName": "Программа",
        "programId": null,
        "content": "Контент проекта",
        "type": "Программа",
        "createdAt": "2024-12-20T12:25:21.715Z",
        "updatedAt": "2024-12-20T12:25:21.715Z",
        "organization": {
          "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
          "organizationName": "Калоеды",
          "parentOrganizationId": null,
          "reportDay": 2,
          "createdAt": "2024-12-04T13:14:47.767Z",
          "updatedAt": "2024-12-06T07:09:10.117Z"
        },
        "targets": [
          {
            "id": "b5b8527e-a753-4ca0-90cc-3bc6ad4375c7",
            "type": "Продукт",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderUserId": "bc807845-08a8-423e-9976-4f60df183ae2",
            "targetState": "Активная",
            "dateStart": "2024-12-20T12:25:21.576Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": null,
            "createdAt": "2024-12-20T12:25:21.960Z",
            "updatedAt": "2024-12-20T12:25:21.960Z",
            "targetHolders": [
              {
                "id": "cc57610d-d428-43f2-a2d2-f102676fda2b",
                "createdAt": "2024-12-20T12:25:22.059Z",
                "updatedAt": "2024-12-20T12:25:22.059Z",
                "user": {
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
              }
            ],
            "isExpired": true
          }
        ],
        "strategy": {
          "id": "c970f786-b785-49da-894c-b9c975ec0e26",
          "strategyNumber": 194,
          "dateActive": null,
          "content": "HTML текст",
          "state": "Черновик",
          "createdAt": "2024-12-20T12:15:04.395Z",
          "updatedAt": "2024-12-20T12:15:04.395Z"
        }
      },
      "projects": [
        {
          "id": "26cc6162-8c3d-440f-8464-67561172bc32",
          "projectNumber": 280,
          "projectName": "НОвый",
          "programId": "3b6e9455-7435-4f6b-bef4-950d40aca37d",
          "content": "Контент проекта",
          "type": "Проект",
          "createdAt": "2024-12-20T12:21:09.823Z",
          "updatedAt": "2024-12-20T12:25:21.811Z",
          "targets": [
            {
              "id": "723b97dd-a8bc-45b5-be03-5c307adf852c",
              "type": "Продукт",
              "orderNumber": 1,
              "content": "Контент задачи",
              "holderUserId": "bc807845-08a8-423e-9976-4f60df183ae2",
              "targetState": "Активная",
              "dateStart": "2024-12-20T12:21:09.602Z",
              "deadline": "2024-09-18T14:59:47.010Z",
              "dateComplete": null,
              "createdAt": "2024-12-20T12:21:09.980Z",
              "updatedAt": "2024-12-20T12:21:09.980Z",
              "targetHolders": [
                {
                  "id": "76760b9f-f548-48d7-a674-f4cd61212b43",
                  "createdAt": "2024-12-20T12:21:10.077Z",
                  "updatedAt": "2024-12-20T12:21:10.077Z",
                  "user": {
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
                }
              ],
              "isExpired": true
            }
          ]
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
    description: 'Программа не найдена!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ 
    name: 'programId', 
    required: true, 
    description: 'Id программы' 
  })
  async findOneProgram(
    @Param('programId') programId: string,
  ): Promise<{ program: ProjectReadDto; projects: ProjectReadDto[] }> {
    const program = await this.projectService.findOneProgramById(programId);
    const projectsInProgram = await this.projectService.findAllNotRejectedProjectsByProgramIdForOrganization(programId, program.organization.id);
    return { program: program, projects: projectsInProgram };
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Вернуть проект по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "project": {
        "id": "26cc6162-8c3d-440f-8464-67561172bc32",
        "projectNumber": 280,
        "projectName": "НОвый",
        "programId": "3b6e9455-7435-4f6b-bef4-950d40aca37d",
        "programNumber": 281,
        "content": "Контент проекта",
        "type": "Проект",
        "createdAt": "2024-12-20T12:21:09.823Z",
        "updatedAt": "2024-12-20T12:25:21.811Z",
        "organization": {
          "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
          "organizationName": "Калоеды",
          "parentOrganizationId": null,
          "reportDay": 2,
          "createdAt": "2024-12-04T13:14:47.767Z",
          "updatedAt": "2024-12-06T07:09:10.117Z"
        },
        "targets": [
          {
            "id": "723b97dd-a8bc-45b5-be03-5c307adf852c",
            "type": "Продукт",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderUserId": "bc807845-08a8-423e-9976-4f60df183ae2",
            "targetState": "Активная",
            "dateStart": "2024-12-20T12:21:09.602Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": null,
            "createdAt": "2024-12-20T12:21:09.980Z",
            "updatedAt": "2024-12-20T12:21:09.980Z",
            "targetHolders": [
              {
                "id": "76760b9f-f548-48d7-a674-f4cd61212b43",
                "createdAt": "2024-12-20T12:21:10.077Z",
                "updatedAt": "2024-12-20T12:21:10.077Z",
                "user": {
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
              }
            ],
            "isExpired": true
          }
        ],
        "strategy": {
          "id": "c970f786-b785-49da-894c-b9c975ec0e26",
          "strategyNumber": 194,
          "dateActive": null,
          "content": "HTML текст",
          "state": "Черновик",
          "createdAt": "2024-12-20T12:15:04.395Z",
          "updatedAt": "2024-12-20T12:15:04.395Z"
        }
      },
      "strategies": [
        {
          "id": "c970f786-b785-49da-894c-b9c975ec0e26",
          "strategyNumber": 194,
          "dateActive": null,
          "content": "HTML текст",
          "state": "Черновик",
          "createdAt": "2024-12-20T12:15:04.395Z",
          "updatedAt": "2024-12-20T12:15:04.395Z"
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
    description: `Проект не найден!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ 
    name: 'projectId', 
    required: true, 
    description: 'Id проекта' 
  })
  async findOne(
    @Param('projectId') projectId: string,
  ): Promise<{ project: ProjectReadDto; strategies: StrategyReadDto[] }> {
    const project = await this.projectService.findOneById(projectId, ['strategy', 'targets.targetHolders.post', 'organization']);
    const strategies = await this.strategyService.findAllActiveForOrganization(project.organization.id);
    return { project: project, strategies: strategies };
  }
}
