import { Controller, Get, HttpStatus, Param } from "@nestjs/common";

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TargetService } from "src/application/services/target/target.service";
import { TargetReadDto } from "src/contracts/target/read-target.dto";



@ApiTags('Target')
@Controller(':userId/targets')
export class TargetController {

    constructor(private readonly targetService: TargetService) { }

    @Get()
    @ApiOperation({ summary: 'Все задачи' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: [
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
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findAll(@Param() userId: string): Promise<TargetReadDto[]> {
        return await this.targetService.findAll()
    }
}