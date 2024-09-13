import { Injectable } from "@nestjs/common";
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

    async findAll(): Promise<AccountReadDto[] | null>{
        const accounts = await this.accountRepository.find();

        return accounts.map(account => ({
            id: account.id,
            accountName: account.accountName,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            user: account.user,
            organizations: account.organizations,
        }))
    }

    async findeOneById(id: string): Promise<AccountReadDto | null>{
        const account = await this.accountRepository.findOneBy({id});
        
        if (!account) return null;
        const accountReadDto: AccountReadDto = {
            id: account.id,
            accountName: account.accountName,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            user: account.user,
            organizations: account.organizations,
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