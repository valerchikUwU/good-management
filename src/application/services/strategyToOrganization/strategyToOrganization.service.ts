import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { OrganizationService } from "../organization/organization.service";
import { InjectRepository } from "@nestjs/typeorm";
import { StrategyToOrganizationRepository } from "./repository/strategyToOrganization.repositoty";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { Logger } from "winston";


@Injectable()
export class StrategyToOrganizationService{
    constructor(
        @InjectRepository(StrategyToOrganization)
        private readonly strategyToOrganizationRepository: StrategyToOrganizationRepository,
        private readonly organizationService: OrganizationService,
        @Inject('winston') private readonly logger: Logger
    )
    {}

    async createSeveral(strategy: Strategy, organizationIds: string[]): Promise<string[]> {
        const createdRelations: string[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new NotFoundException(`Organization not found with id ${organizationId}`);
                }
    
                const strategyToOrganization = new StrategyToOrganization();
                strategyToOrganization.strategy = strategy;
                strategyToOrganization.organization = organization;
    
                const savedRelationId = await this.strategyToOrganizationRepository.insert(strategyToOrganization);
                createdRelations.push(savedRelationId.identifiers[0].id);
            } catch (err) {
                this.logger.error(err);
                if(err instanceof NotFoundException){
                    throw err;
                }

                throw new InternalServerErrorException('Ой, что - то пошло не так при добавлении организаций к стратегии!')
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }

    
    async remove(strategy: StrategyReadDto): Promise<void>{
        await this.strategyToOrganizationRepository.delete({strategy: strategy});
    }
    

}