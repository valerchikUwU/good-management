import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProjectService } from "src/application/services/project/project.service";
import { UsersService } from "src/application/services/users/users.service";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { Project } from "src/domains/project.entity";




@ApiTags('Project')
@Controller(':userId/projects')
export class ProjectController{

    constructor(private readonly projectService: ProjectService,
        private readonly userService: UsersService
    ){}

    @Get()
    @ApiOperation({summary: 'Все проекты'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param('userId') userId: string): Promise<ProjectReadDto[]>{
        return await this.projectService.findAll()
    }


    @Post('new')
    async create(@Param('userId') userId: string, @Body() projectCreateDto: ProjectCreateDto): Promise<Project>{
        const user = await this.userService.findOne(userId);
        projectCreateDto.user = user;
        projectCreateDto.account = user.account;
        return await this.projectService.create(projectCreateDto)
    }
}