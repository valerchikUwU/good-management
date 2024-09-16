import { Controller, Get, Post, Delete, Param, Body, HttpStatus } from '@nestjs/common';
import { AccountService } from "src/application/services/account/account.service";
import { AccountCreateDto } from 'src/contracts/account/create-account.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Account')
@Controller(':userId/account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Найти аккаунт по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {

            id: '1c64b108-5023-4a76-a3ba-2b1657ed0c9f',
            accountName: 'ООО Группа',
            createdAt: "1900-01-01 00:00:00",
            updatedAt: "1900-01-01 00:00:00",
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findUsersAccount(@Param('id') id: string): Promise<AccountReadDto | null> {
        return this.accountService.findeOneById(id)
    }

    @Post('new')
    @ApiOperation({ summary: 'Создать аккаунт' })
    @ApiBody({
        description: 'ДТО для создания аккаунта',
        type: AccountCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            id: '1c64b108-5023-4a76-a3ba-2b1657ed0c9f',
            accountName: 'ООО Группа',
            createdAt: "1900-01-01 00:00:00",
            updatedAt: "1900-01-01 00:00:00",
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async create(@Body() accountCreateDto: AccountCreateDto): Promise<AccountCreateDto> {
        return this.accountService.create(accountCreateDto);
    }

}