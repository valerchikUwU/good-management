import { Injectable } from "@nestjs/common";
import { PolicyRepository } from "./repository/policy.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Policy } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";



@Injectable()
export class PolicyService{
    constructor(
        @InjectRepository(Policy)
        private readonly policyRepository: PolicyRepository){

    }

    async findAll(): Promise<PolicyReadDto[]>{
        const policies = await this.policyRepository.find();

        return policies.map(policy => ({
            id: policy.id,
            policyName: policy.policyName,
            state: policy.state,
            dateActive: policy.dateActive,
            path: policy.path,
            size: policy.size,
            mimetype: policy.mimetype,
            createdAt: policy.createdAt,
            updatedAt: policy.updatedAt,
            user: policy.user
        }))
    }

    async findeOneById(id: string): Promise<PolicyReadDto | null>{
        const policy = await this.policyRepository.findOneBy({id});
        
        if (!policy) return null;
        const policyReadDto: PolicyReadDto = {
            id: policy.id,
            policyName: policy.policyName,
            state: policy.state,
            dateActive: policy.dateActive,
            path: policy.path,
            size: policy.size,
            mimetype: policy.mimetype,
            createdAt: policy.createdAt,
            updatedAt: policy.updatedAt,
            user: policy.user
        }

        return policyReadDto;
    }
}