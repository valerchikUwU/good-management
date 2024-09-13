import { Injectable } from "@nestjs/common";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { OrganizationCreateDto } from "src/contracts/organization/create-organization.dto";
import { Organization } from "src/domains/organization.entity";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { Goal } from "src/domains/goal.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { OrganizationService } from "../organization/organization.service";
import { GoalToOrganizationRepository } from "./repository/goalToOrganization.repository";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class GoalToOrganizationService{
    constructor(
        @InjectRepository(GoalToOrganization)
        private readonly goalToOrganizationRepository: GoalToOrganizationRepository,
        private readonly organizationService: OrganizationService
    )
    {}

    async createSeveral(goal: Goal, organizationIds: string[]): Promise<GoalToOrganization[]> {
        const createdRelations: GoalToOrganization[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new Error(`Organization not found with id ${organizationId}`);
                }
    
                const goalToOrganization = new GoalToOrganization();
                goalToOrganization.goal = goal;
                goalToOrganization.organization = organization;
    
                const savedRelation = await this.goalToOrganizationRepository.save(goalToOrganization);
                createdRelations.push(savedRelation);
            } catch (error) {
                console.error(`Error creating relation for organization ${organizationId}:`, error);
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }
    

}