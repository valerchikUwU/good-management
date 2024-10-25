import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Policy } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { PolicyToOrganizationService } from "../policyToOrganization/policyToOrganization.service";
import { Project, Type } from "src/domains/project.entity";
import { ProjectRepository } from "./repository/project.repository";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { ProjectCreateDto } from "src/contracts/project/create-project.dto";
import { ProjectToOrganizationService } from "../projectToOrganization/projectToOrganization.service";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { Logger } from 'winston';
import { ProjectUpdateDto } from "src/contracts/project/update-project.dto";
import { In, IsNull, Not } from "typeorm";
import { IsNotIn } from "class-validator";


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
        try {
            const projects = await this.projectRepository.find({ where: { account: { id: account.id } } });

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
        catch (err) {
            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех проектов!');
        }
    }

    async findAllProgramsWithoutProjectForAccount(account: AccountReadDto): Promise<ProjectReadDto[]> {
        try {
            const programsWithoutProject = await this.projectRepository.createQueryBuilder('program')
                .where('program.accountId = :accountId', { accountId: account.id })
                .andWhere('program.type = :programType', { programType: Type.PROGRAM })
                .andWhere(qb => {
                    const subQuery = qb.subQuery()
                        .select('project.programId')
                        .from('project', 'project')
                        .where('project.accountId = :accountId', { accountId: account.id })
                        .andWhere('project.type = :projectType', { projectType: Type.PROJECT })
                        .andWhere('project.programId IS NOT NULL')
                        .groupBy('project.programId')  // Добавляем группировку по programId
                        .getQuery();
                    return 'program.id NOT IN ' + subQuery;
                })
                .getMany();

            return programsWithoutProject.map(program => ({
                id: program.id,
                projectNumber: program.projectNumber,
                programId: program.programId,
                content: program.content,
                type: program.type,
                createdAt: program.createdAt,
                updatedAt: program.updatedAt,
                projectToOrganizations: program.projectToOrganizations,
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
                .leftJoin('targets.targetHolders', 'targetHolders')
                .leftJoin('targetHolders.user', 'user')
                .leftJoinAndSelect('project.projectToOrganizations', 'projectToOrganizations')
                .leftJoinAndSelect('projectToOrganizations.organization', 'organization')
                .where('project.id = :id', { id })
                .andWhere('targets.holderUserId = user.id')  // Добавляем условие на совпадение
                .getOne();
            const program = project.programId !== null ? await this.projectRepository.findOne({where: {id: project.programId}}): null
            if (!project) throw new NotFoundException(`Проект с ID: ${id} не найден`);
            const projectReadDto: ProjectReadDto = {
                id: project.id,
                projectNumber: project.projectNumber,
                programId: project.programId,
                programNumber: program !== null ? program.projectNumber : null,
                content: project.content,
                type: project.type,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                projectToOrganizations: project.projectToOrganizations,
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

    async create(projectCreateDto: ProjectCreateDto): Promise<Project> {
        try {


            // Проверка на наличие обязательных данных

            if (!projectCreateDto.projectToOrganizations) {
                throw new BadRequestException('Выберите хотя бы одну организацию для проекта!');
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
            if (updateProjectDto.programId) project.programId = updateProjectDto.programId;
            if (updateProjectDto.content) project.content = updateProjectDto.content;
            if (updateProjectDto.type) project.type = updateProjectDto.type;

            if (updateProjectDto.projectToOrganizations) {
                await this.projectToOrganizationService.remove(project);
                await this.projectToOrganizationService.createSeveral(project, updateProjectDto.projectToOrganizations);
            }
            await this.projectRepository.update(project.id, {programId: project.programId, content: project.content, type: project.type});
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