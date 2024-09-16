import { Controller, Get, HttpStatus, Param } from "@nestjs/common";

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProjectService } from "src/application/services/project/project.service";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";




@ApiTags('Project')
@Controller(':userId/projects')
export class ProjectController{

    constructor(private readonly projectService: ProjectService){}

    @Get()
    @ApiOperation({summary: 'Все проекты'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          ip: "192.168.1.100",
          token: "dd31cc25926db1b45f2e"
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param() userId: string): Promise<ProjectReadDto[]>{
        return await this.projectService.findAll()
    }
}