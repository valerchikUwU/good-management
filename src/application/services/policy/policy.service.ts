import { Injectable } from "@nestjs/common";
import { PolicyRepository } from "./repository/policy.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Policy, Type } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { PolicyToOrganizationService } from "../policyToOrganization/policyToOrganization.service";
import { ReadUserDto } from "src/contracts/user/read-user.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { Account } from "src/domains/account.entity";



@Injectable()
export class PolicyService {
    constructor(
        @InjectRepository(Policy)
        private readonly policyRepository: PolicyRepository,
        private readonly policyToOrganizationService: PolicyToOrganizationService
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<PolicyReadDto[]> {
        const policies = await this.policyRepository.find({ where: { account: { id: account.id } } });

        return policies.map(policy => ({
            id: policy.id,
            policyName: policy.policyName,
            policyNumber: policy.policyNumber,
            state: policy.state,
            type: policy.type,
            dateActive: policy.dateActive,
            content: policy.content,
            createdAt: policy.createdAt,
            updatedAt: policy.updatedAt,
            post: policy.post,
            policyToOrganizations: policy.policyToOrganizations,
            user: policy.user,
            account: policy.account
        }))
    }

    async findeOneById(id: string): Promise<PolicyReadDto | null> {
        const policy = await this.policyRepository.findOneBy({ id });
        if (!policy) return null;
        const policyReadDto: PolicyReadDto = {
            id: policy.id,
            policyName: policy.policyName,
            policyNumber: policy.policyNumber,
            state: policy.state,
            type: policy.type,
            dateActive: policy.dateActive,
            content: policy.content,
            createdAt: policy.createdAt,
            updatedAt: policy.updatedAt,
            post: policy.post,
            policyToOrganizations: policy.policyToOrganizations,
            user: policy.user,
            account: policy.account
        }

        return policyReadDto;
    }

    async create(policyCreateDto: PolicyCreateDto): Promise<Policy> {
        const policy = new Policy();
        policy.policyName = policyCreateDto.policyName;
        policy.state = policyCreateDto.state;
        policy.type = policyCreateDto.type;
        policy.content = policyCreateDto.content;
        policy.user = policyCreateDto.user;
        policy.account = policyCreateDto.account;
        const createdPolicy = await this.policyRepository.save(policy);
        await this.policyToOrganizationService.createSeveral(createdPolicy, policyCreateDto.policyToOrganizations);

        return createdPolicy
    }


    async findDirectivesForAccount(account: AccountReadDto): Promise<PolicyReadDto[]> {
        // Поиск всех политик с типом DIRECTIVE
        const directives = await this.policyRepository.find({ where: { type: Type.DIRECTIVE, account: { id: account.id } } });

        return directives;
    }

    async findInstructionsForAccount(account: AccountReadDto): Promise<PolicyReadDto[]> {

        // Поиск всех политик с типом INSTRUCTION
        const instructions = await this.policyRepository.find({ where: { type: Type.INSTRUCTION, account: { id: account.id } } });
        return instructions
    }
}