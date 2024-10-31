import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ObjectiveService } from "src/application/services/objective/objective.service";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { UsersService } from "src/application/services/users/users.service";
import { ObjectiveCreateDto } from "src/contracts/objective/create-objective.dto";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { ObjectiveUpdateDto } from "src/contracts/objective/update-objective.dto";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { ProducerService } from "src/application/services/producer/producer.service";
import { ObjectiveCreateEventDto } from "src/contracts/objective/createEvent-objective.dto";
import { ObjectiveUpdateEventDto } from "src/contracts/objective/updateEvent-objective.dto";


@ApiTags('Objective')
@Controller(':userId/objectives')
export class ObjectiveController {

    constructor(private readonly objectiveService: ObjectiveService,
        private readonly userService: UsersService,
        private readonly strategyService: StrategyService,
        private readonly producerService: ProducerService,
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
    @ApiOperation({ summary: 'Получить данные для обновления краткосрочной цели по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async beforeUpdate(@Param('userId') userId: string): Promise<StrategyReadDto[]> {
        const user = await this.userService.findOne(userId)
        const strategies = await this.strategyService.findAllRelatedForAccount(user.account)
        return strategies;
    }


    @Patch(':objectiveId/update')
    @ApiOperation({ summary: 'Обновить краткосрочную цель по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: "0a2f6024-e6f7-49b9-a008-70665bd36881"
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'objectiveId', required: true, description: 'Id краткосрочной цели' })
    async update(@Param('userId') userId: string, @Param('objectiveId') objectiveId: string, @Body() objectiveUpdateDto: ObjectiveUpdateDto, @Ip() ip: string): Promise<{id: string}> {
        const user = await this.userService.findOne(userId);
        if (objectiveUpdateDto.strategyId) {
            const strategy = await this.strategyService.findOneById(objectiveUpdateDto.strategyId);
            objectiveUpdateDto.strategy = strategy
        }
        const updatedObjectiveId = await this.objectiveService.update(objectiveId, objectiveUpdateDto);
        const updatedEventObjectiveDto: ObjectiveUpdateEventDto = {
            eventType: 'OBJECTIVE_UPDATED',
            id: updatedObjectiveId,
            situation: objectiveUpdateDto.situation !== undefined ? objectiveUpdateDto.situation : null,
            content: objectiveUpdateDto.content !== undefined ? objectiveUpdateDto.content : null,
            rootCause: objectiveUpdateDto.rootCause !== undefined ? objectiveUpdateDto.rootCause : null,
            updatedAt: new Date(),
            strategyId: objectiveUpdateDto.strategyId !== undefined ? objectiveUpdateDto.strategyId : null,
            accountId: user.account.id
        };
        await this.producerService.sendUpdatedObjectiveToQueue(updatedEventObjectiveDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED OBJECTIVE: ${JSON.stringify(objectiveUpdateDto)} - Краткосрочная цель успешно обновлена!`);
        return {id: updatedObjectiveId};
    }




    @Post('new')
    @ApiOperation({ summary: 'Создать краткосрочную цель' })
    @ApiBody({
        description: 'ДТО для создания цели',
        type: ObjectiveCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.CREATED, description: "ОК!",
        example: "2f17f491-03c4-4bf8-8e40-c741263ed9df"
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async create(@Param('userId') userId: string, @Body() objectiveCreateDto: ObjectiveCreateDto, @Ip() ip: string): Promise<string> {
        const [user, chosenStrategy] = await Promise.all([
            this.userService.findOne(userId),
            this.strategyService.findOneById(objectiveCreateDto.strategyId)
        ]);
        objectiveCreateDto.strategy = chosenStrategy;
        objectiveCreateDto.account = user.account;
        const createdObjectiveId = await this.objectiveService.create(objectiveCreateDto);
        const createdEventObjectiveDto: ObjectiveCreateEventDto = {
            eventType: 'OBJECTIVE_CREATED',
            id: createdObjectiveId,
            situation: objectiveCreateDto.situation !== undefined ? objectiveCreateDto.situation : null,
            content: objectiveCreateDto.content !== undefined ? objectiveCreateDto.content : null,
            rootCause: objectiveCreateDto.rootCause !== undefined ? objectiveCreateDto.rootCause : null,
            createdAt: new Date(),
            strategyId: chosenStrategy.id,
            accountId: user.account.id
        };
        await this.producerService.sendCreatedObjectiveToQueue(createdEventObjectiveDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - objectiveCreateDto: ${JSON.stringify(objectiveCreateDto)} - Создана новая краткосрочная цель!`)
        return createdObjectiveId;
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
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'strategyId', required: true, description: 'Id стратегии' })
    async findOne(@Param('userId') userId: string, @Param('strategyId') strategyId: string, @Ip() ip: string): Promise<ObjectiveReadDto> {
        const objective = await this.objectiveService.findeOneByStrategyId(strategyId);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT OBJECTIVE: ${JSON.stringify(objective)} - Получить краткосрочную цель по ID!`);
        return objective;
    }
}