import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";

import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { use } from "passport";
import { ProjectService } from "src/application/services/project/project.service";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { TargetService } from "src/application/services/target/target.service";
import { UsersService } from "src/application/services/users/users.service";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { TargetCreateDto } from "src/contracts/target/create-target.dto";
import { TargetHolderCreateDto } from "src/contracts/targetHolder/create-targetHolder.dto";
import { Project } from "src/domains/project.entity";




@ApiTags('Project')
@Controller(':userId/projects')
export class ProjectController{

    constructor(private readonly projectService: ProjectService,
        private readonly userService: UsersService,
        private readonly strategyService: StrategyService,
        private readonly targetService: TargetService
    ){}

    @Get()
    @ApiOperation({summary: 'Все проекты'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param('userId') userId: string): Promise<ProjectReadDto[]>{
        const user = await this.userService.findOne(userId)
        return await this.projectService.findAllForAccount(user.account)
    }


    @Post('new')
    async create(@Param('userId') userId: string, @Body() projectCreateDto: ProjectCreateDto, targetCreateDtos: TargetCreateDto[], strategyId: string): Promise<Project>{
        const user = await this.userService.findOne(userId);
        const strategy = await this.strategyService.findeOneById(strategyId);
        projectCreateDto.user = user;
        projectCreateDto.account = user.account;
        projectCreateDto.strategy = strategy;
        const createdProject = await this.projectService.create(projectCreateDto);
        for(const targetCreateDto of targetCreateDtos){
            targetCreateDto.project = createdProject;
            await this.targetService.create(targetCreateDto);
        }
        return createdProject;
    }


    
    @Get(':projectId')
    @ApiOperation({summary: 'Вернуть проект по ID'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    @ApiParam({name: 'projectId', required: true, description: 'Id пользователя'})
    async findOne(@Param('userId') userId: string, @Param('projectId') projectId: string): Promise<ProjectReadDto>{
        return await this.projectService.findeOneById(projectId);
    }
}