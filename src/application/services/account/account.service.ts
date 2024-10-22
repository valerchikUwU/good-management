import { Injectable, NotFoundException } from "@nestjs/common";
import { AccountRepository } from "./repository/account.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/domains/account.entity";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { AccountCreateDto } from "src/contracts/account/create-account.dto";



@Injectable()
export class AccountService{
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: AccountRepository
    ){

    }

    async findAll(): Promise<AccountReadDto[]>{
        const accounts = await this.accountRepository.find();

        return accounts.map(account => ({
            id: account.id,
            accountName: account.accountName,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            users: account.users,
            organizations: account.organizations,
            goals: account.goals,
            objectives: account.objectives,
            policies: account.policies,
            projects: account.projects,
            strategies: account.strategies,
            posts: account.posts,
            statistics: account.statistics,
            roleSettings: account.roleSettings,
            policyDirectories: account.policyDirectories,
            converts: account.converts
        }))
    }

    async findeOneById(id: string): Promise<AccountReadDto>{
        const account = await this.accountRepository.findOne({where: {id}, relations: ['users', 'organizations']});
        if (!account) throw new NotFoundException('Аккаунт не найден!');
        const accountReadDto: AccountReadDto = {
            id: account.id,
            accountName: account.accountName,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            users: account.users,
            organizations: account.organizations,
            goals: account.goals,
            objectives: account.objectives,
            policies: account.policies,
            projects: account.projects,
            strategies: account.strategies,
            posts: account.posts,
            statistics: account.statistics,
            roleSettings: account.roleSettings,
            policyDirectories: account.policyDirectories,
            converts: account.converts
        }

        return accountReadDto;
    }

    async remove(id: string): Promise<void>{
        await this.accountRepository.delete(id)
    }

    async create(accountCreateDto: AccountCreateDto): Promise<Account>{
        const account = new Account();
        account.accountName = accountCreateDto.accountName;
        return await this.accountRepository.save(account);
    }
}