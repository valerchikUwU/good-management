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
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param() userId: string): Promise<TargetReadDto[]>{
        return await this.targetService.findAll()
    }
}