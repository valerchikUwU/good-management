import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ObjectiveService } from "src/application/services/objective/objective.service";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { UsersService } from "src/application/services/users/users.service";
import { ObjectiveCreateDto } from "src/contracts/objective/create-objective.dto";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { ObjectiveUpdateDto } from "src/contracts/objective/update-objective.dto";
import { Objective } from "src/domains/objective.entity";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { strategies } from "passport";


@ApiTags('Objective')
@Controller(':userId/objectives')
export class ObjectiveController {

    constructor(private readonly objectiveService: ObjectiveService,
        private readonly userService: UsersService,
        private readonly strategyService: StrategyService,
        @Inject('winston') private readonly logger: Logger
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все краткосрочные цели' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: [
            {
                id: "2f17f491-03c4-4bf8-8e40-c741263ed9df",
                orderNumber: 1,
                situation: "Текст",
                content: "Контент",
                rootCause: "Причина",
                createdAt: "2024-09-20T14:58:53.054Z",
                updatedAt: "2024-09-20T14:58:53.054Z"
              }
          ]
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<ObjectiveReadDto[]> {
        const user = await this.userService.findOne(userId);
        const objectives = await this.objectiveService.findAllForAccount(user.account);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - OBJECTIVES: ${JSON.stringify(objectives)} - ВСЕ КРАТКОСРОЧНЫЕ ЦЕЛИ!`);
        return objectives;
    }

    @Get('new')
    @ApiOperation({ summary: 'Получить данные для создания новой краткосрочной цели' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: [
            {
              id: "2a72e4ed-9d95-4a10-8223-4a201a5d6f2e",
              strategyNumber: 3,
              strategyName: "Стратегия",
              dateActive: null,
              content: "HTML текст",
              state: "Активный",
              createdAt: "2024-09-26T15:33:30.985Z",
              updatedAt: "2024-09-26T15:33:30.985Z"
            }
          ]

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<StrategyReadDto[]> {
        const user = await this.userService.findOne(userId)
        const strategies = await this.strategyService.findAllActiveWithoutObjectiveForAccount(user.account)
        return strategies; 
    }


    @Get('update')
    @ApiOperation({summary: 'Получить данные для обновления краткосрочной цели по ID'})    
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
          }
        })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async beforeUpdate(@Param('userId') userId: string): Promise<StrategyReadDto[]>{
        const user = await this.userService.findOne(userId)
        const strategies = await this.strategyService.findAllRelatedForAccount(user.account)
        return strategies;
    }


    @Patch(':objectiveId/update')
    @ApiOperation({summary: 'Обновить краткосрочную цель по ID'})    
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
            id: "1c509c6d-aba9-41c1-8b04-dd196d0af0c7",
            orderNumber: 2,
            situation: "Вот это ситуация",
            content: "Контент 18+",
            rootCause: "Даун",
            createdAt: "2024-09-27T10:18:26.882Z",
            updatedAt: "2024-09-27T10:29:07.244Z",
            strategy: {
              id: "2a72e4ed-9d95-4a10-8223-4a201a5d6f2e",
              strategyNumber: 3,
              strategyName: "Стратегия",
              dateActive: null,
              content: "HTML текст",
              state: "Активный",
              createdAt: "2024-09-26T15:33:30.985Z",
              updatedAt: "2024-09-26T15:33:30.985Z",
              strategyToOrganizations: [
                {
                  id: "85199db7-f982-4c23-a567-10dde5143150",
                  createdAt: "2024-09-26T15:33:31.179Z",
                  updatedAt: "2024-09-26T15:33:31.179Z",
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
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({name: 'objectiveId', required: true, description: 'Id краткосрочной цели'})
    async update(@Param('userId') userId: string, @Param('objectiveId') objectiveId: string, @Body() objectiveUpdateDto: ObjectiveUpdateDto, @Ip() ip: string): Promise<ObjectiveReadDto>{
        if(objectiveUpdateDto.strategyId){
            const strategy = await this.strategyService.findOneById(objectiveUpdateDto.strategyId);
            objectiveUpdateDto.strategy = strategy
        }
        const updatedObjective = await this.objectiveService.update(objectiveId, objectiveUpdateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED OBJECTIVE: ${JSON.stringify(objectiveUpdateDto)} - Краткосрочная цель успешно обновлена!`);
        return updatedObjective;
    }




    @Post('new')
    @ApiOperation({ summary: 'Создать краткосрочную цель' })
    @ApiBody({
        description: 'ДТО для создания цели',
        type: ObjectiveCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            orderNumber: 1,
            situation: "Текст",
            content: "Контент",
            rootCause: "Причина",
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
            account: {
                id: "a1118813-8985-465b-848e-9a78b1627f11",
                accountName: "OOO PIPKA",
                createdAt: "2024-09-16T12:53:29.593Z",
                updatedAt: "2024-09-16T12:53:29.593Z"
            },
            id: "2f17f491-03c4-4bf8-8e40-c741263ed9df",
            createdAt: "2024-09-20T14:58:53.054Z",
            updatedAt: "2024-09-20T14:58:53.054Z"
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async create(@Param('userId') userId: string, @Body() objectiveCreateDto: ObjectiveCreateDto, @Ip() ip: string): Promise<Objective> {
        const chosenStrategy = await this.strategyService.findOneById(objectiveCreateDto.strategyId);
        objectiveCreateDto.strategy = chosenStrategy;
        const user = await this.userService.findOne(userId)
        objectiveCreateDto.account = user.account;
        const createdObjective = await this.objectiveService.create(objectiveCreateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - objectiveCreateDto: ${JSON.stringify(objectiveCreateDto)} - Создана новая краткосрочная цель!`)
        return createdObjective;
    }


    @Get(':strategyId')
    @ApiOperation({ summary: 'Получить цель по ID стратегии' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            id: "2f17f491-03c4-4bf8-8e40-c741263ed9df",
            orderNumber: 1,
            situation: "Текст",
            content: "Контент",
            rootCause: "Причина",
            createdAt: "2024-09-20T14:58:53.054Z",
            updatedAt: "2024-09-20T14:58:53.054Z"
          }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a'  })
    @ApiParam({ name: 'strategyId', required: true, description: 'Id стратегии' })
    async findOne(@Param('userId') userId: string, @Param('strategyId') strategyId: string, @Ip() ip: string): Promise<ObjectiveReadDto> {
        const objective = await this.objectiveService.findeOneByStrategyId(strategyId);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT OBJECTIVE: ${JSON.stringify(objective)} - Получить краткосрочную цель по ID!`);
        return objective;
    }
}