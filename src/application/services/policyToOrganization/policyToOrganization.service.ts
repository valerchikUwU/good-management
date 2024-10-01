import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Goal } from "src/domains/goal.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { OrganizationService } from "../organization/organization.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PolicyToOrganizationRepository } from "./repository/policyToOrganization.repository";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { Policy } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { Logger } from "winston";


@Injectable()
export class PolicyToOrganizationService{
    constructor(
        @InjectRepository(PolicyToOrganization)
        private readonly policyToOrganizationRepository: PolicyToOrganizationRepository,
        private readonly organizationService: OrganizationService,
        @Inject('winston') private readonly logger: Logger
    )
    {}

    async createSeveral(policy: Policy, organizationIds: string[]): Promise<PolicyToOrganization[]> {
        const createdRelations: PolicyToOrganization[] = [];
    
        for (const organizationId of organizationIds) {
            try {
                const organization = await this.organizationService.findOneById(organizationId);
                if (!organization) {
                    throw new NotFoundException(`Organization not found with id ${organizationId}`);
                }
    
                const policyToOrganization = new PolicyToOrganization();
                policyToOrganization.policy = policy;
                policyToOrganization.organization = organization;
    
                const savedRelation = await this.policyToOrganizationRepository.save(policyToOrganization);
                createdRelations.push(savedRelation);
            } catch (err) {
                this.logger.error(err);
                if(err instanceof NotFoundException){
                    throw err;
                }

                throw new InternalServerErrorException('Ой, что - то пошло не так при добавлении организаций к политике!')
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }

    async remove(policy: PolicyReadDto): Promise<void>{
        await this.policyToOrganizationRepository.delete({policy: policy});
    }
    

}