import { Body, Controller, Get, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ObjectiveService } from "src/application/services/objective/objective.service";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { UsersService } from "src/application/services/users/users.service";
import { ObjectiveCreateDto } from "src/contracts/objective/create-objective.dto";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { Objective } from "src/domains/objective.entity";


@ApiTags('Objective')
@Controller(':userId/objectives')
export class ObjectiveController {

    constructor(private readonly objectiveService: ObjectiveService,
        private readonly userService: UsersService,
        private readonly strategyService: StrategyService
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
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(@Param('userId') userId: string): Promise<ObjectiveReadDto[]> {
        const user = await this.userService.findOne(userId);
        return await this.objectiveService.findAllForAccount(user.account);
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
    async create(@Param('userId') userId: string, @Body() objectiveCreateDto: ObjectiveCreateDto): Promise<Objective> {
        const chosenStrategy = await this.strategyService.findeOneById(objectiveCreateDto.strategyId);
        objectiveCreateDto.strategy = chosenStrategy;
        const user = await this.userService.findOne(userId)
        objectiveCreateDto.account = user.account;
        return this.objectiveService.create(objectiveCreateDto);
    }


    @Get(':objectiveId')
    @ApiOperation({ summary: 'Получить цель по ID' })
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
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiParam({ name: 'objectiveId', required: true, description: 'Id краткосрочной цели' })
    async findOne(@Param('userId') userId: string, @Param('goalId') goalId: string): Promise<ObjectiveReadDto> {
        return await this.objectiveService.findeOneById(goalId);
    }
}