import { Injectable } from "@nestjs/common";
import { Goal } from "src/domains/goal.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { OrganizationService } from "../organization/organization.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { Policy } from "src/domains/policy.entity";
import { ObjectiveToOrganizationRepository } from "./repository/objectiveToOrganization.repository";
import { ObjectiveToOrganization } from "src/domains/objectiveToOrganization.entity";
import { Objective } from "src/domains/objective.entity";


@Injectable()
export class ObjectiveToOrganizationService{
    constructor(
        @InjectRepository(ObjectiveToOrganization)
        private readonly objectiveToOrganizationRepository: ObjectiveToOrganizationRepository,
        private readonly organizationService: OrganizationService
    )
    {}

    async createSeveral(objective: Objective, organizationIds: string[]): Promise<ObjectiveToOrganization[]> {
        const createdRelations: ObjectiveToOrganization[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new Error(`Organization not found with id ${organizationId}`);
                }
    
                const objectiveToOrganization = new ObjectiveToOrganization();
                objectiveToOrganization.objective = objective;
                objectiveToOrganization.organization = organization;
    
                const savedRelation = await this.objectiveToOrganizationRepository.save(objectiveToOrganization);
                createdRelations.push(savedRelation);
            } catch (error) {
                console.error(`Error creating relation for organization ${organizationId}:`, error);
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }
    

}