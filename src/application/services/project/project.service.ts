import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project, Type } from "src/domains/project.entity";
import { ProjectRepository } from "./repository/project.repository";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { Logger } from 'winston';
import { ProjectUpdateDto } from "src/contracts/project/update-project.dto";


@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: ProjectRepository,
        @Inject('winston') private readonly logger: Logger,
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<ProjectReadDto[]> {
        try {
            const projects = await this.projectRepository.find({ where: { account: { id: account.id } } });

            return projects.map(project => ({
                id: project.id,
                projectNumber: project.projectNumber,
                projectName: project.projectName,
                programId: project.programId,
                content: project.content,
                type: project.type,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                organization: project.organization,
                targets: project.targets,
                strategy: project.strategy,
                account: project.account,
                user: project.user
            }))
        }
        catch (err) {
            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех проектов!');
        }
    }

    async findAllProgramsForAccount(account: AccountReadDto): Promise<ProjectReadDto[]> {
        try {
            const programs = await this.projectRepository.find({where: {type: Type.PROGRAM}})

            return programs.map(program => ({
                id: program.id,
                projectNumber: program.projectNumber,
                projectName: program.projectName,
                programId: program.programId,
                content: program.content,
                type: program.type,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                organization: program.organization,
                targets: program.targets,
                strategy: program.strategy,
                account: program.account,
                user: program.user
            }))
        }
        catch (err) {
            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех проектов!');
        }
    }

    async findOneById(id: string): Promise<ProjectReadDto> {
        try {
            const project = await this.projectRepository
                .createQueryBuilder('project')
                .leftJoinAndSelect('project.strategy', 'strategy')
                .leftJoinAndSelect('project.targets', 'targets')
                .leftJoinAndSelect('targets.targetHolders', 'targetHolders')
                .leftJoinAndSelect('targetHolders.user', 'user')
                .leftJoinAndSelect('project.organization', 'organization')
                .where('project.id = :id', { id })
                .getOne();
            let program: ProjectReadDto;
            if (project.programId !== null){
                program = await this.projectRepository.findOne({where: {id: project.programId}})
            }
            else {
                program = null
            }
            if (!project) throw new NotFoundException(`Проект с ID: ${id} не найден`);
            const projectReadDto: ProjectReadDto = {
                id: project.id,
                projectNumber: project.projectNumber,
                projectName: project.projectName,
                programId: project.programId,
                programNumber: program !== null ? program.projectNumber : null,
                content: project.content,
                type: project.type,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                organization: project.organization,
                targets: project.targets,
                strategy: project.strategy,
                account: project.account,
                user: project.user,
            }

            return projectReadDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении проекта');
        }
    }

    async findOneProgramById(id: string): Promise<{program: ProjectReadDto, projects: ProjectReadDto[]}> {
        try {
            const program = await this.projectRepository.findOne({where: {id: id}})
            const projects = await this.projectRepository.find({where: {programId: id}})
            if (!program) throw new NotFoundException(`Проект с ID: ${id} не найден`);
            const programReadDto: ProjectReadDto = {
                id: program.id,
                projectNumber: program.projectNumber,
                projectName: program.projectName,
                programId: program.programId,
                content: program.content,
                type: program.type,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                organization: program.organization,
                targets: program.targets,
                strategy: program.strategy,
                account: program.account,
                user: program.user,
            }

            return {program: programReadDto, projects: projects};
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении проекта');
        }
    }

    async create(projectCreateDto: ProjectCreateDto): Promise<string> {
        try {


            // Проверка на наличие обязательных данных

            if (!projectCreateDto.organizationId) {
                throw new BadRequestException('Выберите организацию для проекта!');
            }

            const project = new Project();
            project.projectName = projectCreateDto.projectName;
            project.programId = projectCreateDto.programId;
            project.content = projectCreateDto.content;
            project.type = projectCreateDto.type;
            project.organization = projectCreateDto.organization;
            project.user = projectCreateDto.user;
            project.account = projectCreateDto.account;
            project.strategy = projectCreateDto.strategy;
            const projectCreatedId = await this.projectRepository.insert(project);

            return projectCreatedId.identifiers[0].id;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании проекта')
        }
    }



    async update(_id: string, updateProjectDto: ProjectUpdateDto): Promise<string> {
        try {
            const project = await this.projectRepository.findOne({ where: { id: _id } });
            if (!project) {
                throw new NotFoundException(`Проект с ID ${_id} не найден`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateProjectDto.projectName) project.projectName = updateProjectDto.projectName;
            if (updateProjectDto.programId) project.programId = updateProjectDto.programId;
            if (updateProjectDto.content) project.content = updateProjectDto.content;
            if (updateProjectDto.type) project.type = updateProjectDto.type;
            if (updateProjectDto.organizationId) project.organization = updateProjectDto.organization;

            await this.projectRepository.update(project.id, {projectName: project.projectName, programId: project.programId, content: project.content, type: project.type, organization: project.organization});
            return project.id
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