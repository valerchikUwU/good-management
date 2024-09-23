import { Injectable } from "@nestjs/common";
import { OrganizationService } from "../organization/organization.service";
import { InjectRepository } from "@nestjs/typeorm";
import { StrategyToOrganizationRepository } from "./repository/strategyToOrganization.repositoty";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";


@Injectable()
export class StrategyToOrganizationService{
    constructor(
        @InjectRepository(StrategyToOrganization)
        private readonly strategyToOrganizationRepository: StrategyToOrganizationRepository,
        private readonly organizationService: OrganizationService
    )
    {}

    async createSeveral(strategy: Strategy, organizationIds: string[]): Promise<StrategyToOrganization[]> {
        const createdRelations: StrategyToOrganization[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new Error(`Organization not found with id ${organizationId}`);
                }
    
                const strategyToOrganization = new StrategyToOrganization();
                strategyToOrganization.strategy = strategy;
                strategyToOrganization.organization = organization;
    
                const savedRelation = await this.strategyToOrganizationRepository.save(strategyToOrganization);
                createdRelations.push(savedRelation);
            } catch (error) {
                console.error(`Error creating relation for organization ${organizationId}:`, error);
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }

    
    async remove(strategy: StrategyReadDto): Promise<void>{
        await this.strategyToOrganizationRepository.delete({strategy: strategy});
    }
    

}