import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AccountService } from "src/application/services/account/account.service";
import { AccountCreateDto } from 'src/contracts/account/create-account.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Account')
@Controller(':userId/account')
export class AccountController{
    constructor(private readonly accountService: AccountService){}

    @Get(':id')
    async findUsersAccount(@Param('id') id: string): Promise<AccountReadDto | null>{
        return this.accountService.findeOneById(id) 
    }

    @Post('new')
    async create(@Body() accountCreateDto: AccountCreateDto): Promise<AccountCreateDto>{
        return this.accountService.create(accountCreateDto);
    }

}