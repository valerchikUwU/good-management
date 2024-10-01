import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Policy } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { PolicyToOrganizationService } from "../policyToOrganization/policyToOrganization.service";
import { Project } from "src/domains/project.entity";
import { ProjectRepository } from "./repository/project.repository";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { ProjectToOrganizationService } from "../projectToOrganization/projectToOrganization.service";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { Logger } from 'winston';
import { ProjectUpdateDto } from "src/contracts/project/update-project.dto";


@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: ProjectRepository,
        private readonly projectToOrganizationService: ProjectToOrganizationService,
        @Inject('winston') private readonly logger: Logger,
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<ProjectReadDto[]> {
        try{
            const projects = await this.projectRepository.find({where: {account: {id: account.id}}});

            return projects.map(project => ({
                id: project.id,
                projectNumber: project.projectNumber,
                programId: project.programId,
                content: project.content,
                type: project.type,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                projectToOrganizations: project.projectToOrganizations,
                targets: project.targets,
                strategy: project.strategy,
                account: project.account,
                user: project.user
            }))
        }
        catch(err){
            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех проектов!');
        }
    }

    async findeOneById(id: string): Promise<ProjectReadDto | null> {
        try{
            const project = await this.projectRepository.findOne({ where: {id: id}, relations: ['targets', 'projectToOrganizations.organization'] });

            if (!project) throw new NotFoundException(`Проект с ID: ${id} не найден`);
            const projectReadDto: ProjectReadDto = {
                id: project.id,
                projectNumber: project.projectNumber,
                programId: project.programId,
                content: project.content,
                type: project.type,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                projectToOrganizations: project.projectToOrganizations,
                targets: project.targets,
                strategy: project.strategy,
                account: project.account,
                user: project.user
            }
    
            return projectReadDto;
        }
        catch(err){
            
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении проекта');
        }
    }

    async create(projectCreateDto: ProjectCreateDto): Promise<Project> {
        try{

            
            // Проверка на наличие обязательных данных
            
            if (!projectCreateDto.content) {
                throw new BadRequestException('Проект не может быть пустой!');
            }
            if (!projectCreateDto.type) {
                throw new BadRequestException('Выберите тип проекта!');
            }
            if (!projectCreateDto.projectToOrganizations) {
                throw new BadRequestException('Выберите хотя бы одну организацию для проекта!');
            }
            if (!projectCreateDto.strategyId) {
                throw new BadRequestException('Выберите стратегию для проекта!');
            }

            const project = new Project();
            project.programId = projectCreateDto.programId;
            project.content = projectCreateDto.content;
            project.type = projectCreateDto.type;
            project.user = projectCreateDto.user;
            project.account = projectCreateDto.account;
            project.strategy = projectCreateDto.strategy;
            const projectCreated = await this.projectRepository.save(project);
            await this.projectToOrganizationService.createSeveral(projectCreated, projectCreateDto.projectToOrganizations);
    
            return projectCreated;
        }
        catch(err){
            
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании проекта')
        }
    }



    async update(_id: string, updateProjectDto: ProjectUpdateDto): Promise<ProjectReadDto> {
        try {
            const project = await this.projectRepository.findOne({ where: { id: _id } });
            if (!project) {
                throw new NotFoundException(`Проект с ID ${_id} не найден`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateProjectDto.programId) project.programId = updateProjectDto.programId;
            if (updateProjectDto.content) project.content = updateProjectDto.content;
            if (updateProjectDto.type) project.type = updateProjectDto.type;

            if (updateProjectDto.projectToOrganizations) {
                await this.projectToOrganizationService.remove(project);
                await this.projectToOrganizationService.createSeveral(project, updateProjectDto.projectToOrganizations);
            }

            return this.projectRepository.save(project);
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении проекта');
        }

    }
}