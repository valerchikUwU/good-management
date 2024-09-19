import { Injectable } from "@nestjs/common";
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



@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: ProjectRepository,
        private readonly projectToOrganizationService: ProjectToOrganizationService
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<ProjectReadDto[]> {
        const projects = await this.projectRepository.find({where: {account: {id: account.id}}});

        return projects.map(project => ({
            id: project.id,
            programId: project.programId,
            content: project.content,
            type: project.type,
            projectToOrganizations: project.projectToOrganizations,
            targets: project.targets,
            account: project.account,
            user: project.user
        }))
    }

    async findeOneById(id: string): Promise<ProjectReadDto | null> {
        const project = await this.projectRepository.findOneBy({ id });

        if (!project) return null;
        const projectReadDto: ProjectReadDto = {
            id: project.id,
            programId: project.programId,
            content: project.content,
            type: project.type,
            projectToOrganizations: project.projectToOrganizations,
            targets: project.targets,
            account: project.account,
            user: project.user
        }

        return projectReadDto;
    }

    async create(projectCreateDto: ProjectCreateDto): Promise<Project> {
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
}