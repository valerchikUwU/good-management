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
export class ObjectiveController{

    constructor(private readonly objectiveService: ObjectiveService,
        private readonly userService: UsersService,
        private readonly strategyService: StrategyService
    ){}

    @Get()
    @ApiOperation({summary: 'Все краткосрочные цели'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param('userId') userId: string): Promise<ObjectiveReadDto[]>{
        return await this.objectiveService.findAll()
    }



    @Post('new')
    @ApiOperation({summary: 'Создать краткосрочную цель'})
    @ApiBody({
        description: 'ДТО для создания цели',
        type: ObjectiveCreateDto,
        required: true,
    })
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    async create(@Param('userId') userId: string, @Body() objectiveCreateDto: ObjectiveCreateDto, @Query('addStrategyId') addStrategyId: string): Promise<Objective>{
        const chosenStrategy = await this.strategyService.findeOneById(addStrategyId);
        objectiveCreateDto.strategy = chosenStrategy;
        const user = await this.userService.findOne(userId)
        objectiveCreateDto.account = user.account;
        return this.objectiveService.create(objectiveCreateDto);
    }
}