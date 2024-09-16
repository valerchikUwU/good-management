import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GoalService } from "src/application/services/goal/goal.service";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";



@ApiTags('Goal')
@Controller(':userId/goals')
export class GoalController{
    constructor(private readonly goalService: GoalService){}

    @Get()
    @ApiOperation({summary: 'Все цели'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          ip: "192.168.1.100",
          token: "dd31cc25926db1b45f2e"
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param() userId: string): Promise<GoalReadDto[]>{
        return await this.goalService.findAll()
    }
}