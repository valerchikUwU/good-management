import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";

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




@ApiTags('Project')
@Controller(':userId/projects')
export class ProjectController {

    constructor(private readonly projectService: ProjectService,
        private readonly userService: UsersService,
        private readonly strategyService: StrategyService,
        private readonly targetService: TargetService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все проекты' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: [
            {
              id: "f2c217bc-367b-4d72-99c3-37d725306786",
              programId: null,
              content: "Контент политики",
              type: "Проект",
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
          ]
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(@Param('userId') userId: string): Promise<ProjectReadDto[]> {
        const user = await this.userService.findOne(userId)
        return await this.projectService.findAllForAccount(user.account)
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
              strategyName: "Стратегия",
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
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async create(@Param('userId') userId: string, @Body() projectCreateDto: ProjectCreateDto): Promise<Project> {
        const user = await this.userService.findOne(userId);
        const strategy = await this.strategyService.findeOneById(projectCreateDto.strategyId);
        projectCreateDto.user = user;
        projectCreateDto.account = user.account;
        projectCreateDto.strategy = strategy;
        const createdProject = await this.projectService.create(projectCreateDto);
        for (const targetCreateDto of projectCreateDto.targetCreateDtos) {
            targetCreateDto.project = createdProject;
            await this.targetService.create(targetCreateDto);
        }
        return createdProject;
    }



    @Get(':projectId')
    @ApiOperation({ summary: 'Вернуть проект по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            id: "f2c217bc-367b-4d72-99c3-37d725306786",
            programId: null,
            content: "Контент политики",
            type: "Проект",
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
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiParam({ name: 'projectId', required: true, description: 'Id пользователя' })
    async findOne(@Param('userId') userId: string, @Param('projectId') projectId: string): Promise<ProjectReadDto> {
        return await this.projectService.findeOneById(projectId);
    }
}