import { Controller, Get, HttpStatus, Param } from "@nestjs/common";

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TargetService } from "src/application/services/target/target.service";
import { TargetReadDto } from "src/contracts/target/read-target.dto";



@ApiTags('Target')
@Controller(':userId/targets')
export class TargetController{

    constructor(private readonly targetService: TargetService){}

    @Get()
    @ApiOperation({summary: 'Все задачи'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          ip: "192.168.1.100",
          token: "dd31cc25926db1b45f2e"
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param() userId: string): Promise<TargetReadDto[]>{
        return await this.targetService.findAll()
    }
}