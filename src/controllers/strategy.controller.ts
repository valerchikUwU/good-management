import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { StrategyCreateDto } from "src/contracts/strategy/create-strategy.dto";
import { UsersService } from "src/application/services/users/users.service";
import { Strategy } from "src/domains/strategy.entity";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";

@ApiTags('Strategy')
@Controller(':userId/strategies')
export class StrategyController{
    constructor(
        private readonly strategyService: StrategyService,
        private readonly userService: UsersService
    )
    {}

    @Get()
    @ApiOperation({summary: 'Все стратегии'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param('userId') userId: string): Promise<StrategyReadDto[]>{
        const user = await this.userService.findOne(userId);
        return await this.strategyService.findAllForAccount(user.account)
    }

    @Post('new')
    @ApiOperation({summary: 'Создать стратегию'})
    @ApiBody({
        description: 'ДТО для создания цели',
        type: StrategyCreateDto,
        required: true,
    })
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async create(@Param('userId') userId: string, @Body() strategyCreateDto: StrategyCreateDto): Promise<Strategy>{
        const user = await this.userService.findOne(userId);
        strategyCreateDto.user = user;
        return await this.strategyService.create(strategyCreateDto)
    }
}