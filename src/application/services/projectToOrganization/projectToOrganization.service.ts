import { Injectable } from "@nestjs/common";
import { OrganizationService } from "../organization/organization.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { ProjectToOrganizationRepository } from "./repository/projectToOrganization.repository";
import { Project } from "src/domains/project.entity";


@Injectable()
export class ProjectToOrganizationService{
    constructor(
        @InjectRepository(ProjectToOrganization)
        private readonly projectToOrganizationRepository: ProjectToOrganizationRepository,
        private readonly organizationService: OrganizationService
    )
    {}

    async createSeveral(project: Project, organizationIds: string[]): Promise<ProjectToOrganization[]> {
        const createdRelations: ProjectToOrganization[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new Error(`Organization not found with id ${organizationId}`);
                }
    
                const projectToOrganization = new ProjectToOrganization();
                projectToOrganization.project = project;
                projectToOrganization.organization = organization;
    
                const savedRelation = await this.projectToOrganizationRepository.save(projectToOrganization);
                createdRelations.push(savedRelation);
            } catch (error) {
                console.error(`Error creating relation for organization ${organizationId}:`, error);
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }
    

}