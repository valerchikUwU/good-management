import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { OrganizationService } from "../organization/organization.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { ProjectToOrganizationRepository } from "./repository/projectToOrganization.repository";
import { Project } from "src/domains/project.entity";
import { ProjectReadDto } from "src/contracts/project/read-project.dto";
import { Logger } from "winston";


@Injectable()
export class ProjectToOrganizationService{
    constructor(
        @InjectRepository(ProjectToOrganization)
        private readonly projectToOrganizationRepository: ProjectToOrganizationRepository,
        private readonly organizationService: OrganizationService,
        @Inject('winston') private readonly logger: Logger
    )
    {}

    async createSeveral(project: Project, organizationIds: string[]): Promise<string[]> {
        const createdRelations: string[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new Error(`Organization not found with id ${organizationId}`);
                }
    
                const projectToOrganization = new ProjectToOrganization();
                projectToOrganization.project = project;
                projectToOrganization.organization = organization;
    
                const savedRelationId = await this.projectToOrganizationRepository.insert(projectToOrganization);
                createdRelations.push(savedRelationId.identifiers[0].id);
            } catch (err) {
                this.logger.error(err);
                if(err instanceof NotFoundException){
                    throw err;
                }

                throw new InternalServerErrorException('Ой, что - то пошло не так при добавлении организаций к проекту!')
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }

    
    async remove(project: Project): Promise<void>{
        await this.projectToOrganizationRepository.delete({project: project});
    }
    

}