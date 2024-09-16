import { Controller, Get, HttpStatus, Param } from "@nestjs/common";

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyService } from "src/application/services/strategy/strategy.service";

@ApiTags('Strategy')
@Controller(':userId/strategies')
export class StrategyController{
    constructor(
        private readonly strategyService: StrategyService
    )
    {}

    @Get()
    @ApiOperation({summary: 'Все стратегии'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          ip: "192.168.1.100",
          token: "dd31cc25926db1b45f2e"
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param() userId: string): Promise<StrategyReadDto[]>{
        return await this.strategyService.findAll()
    }
}