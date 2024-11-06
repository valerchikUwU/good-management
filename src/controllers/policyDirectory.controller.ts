import { Body, Controller, Delete, Get, HttpStatus, Inject, Ip, Param, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PolicyDirectoryService } from "src/application/services/policyDirectory/policyDirectory.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyDirectoryCreateDto } from "src/contracts/policyDirectory/create-policyDirectory.dto";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';
import { PolicyDirectory } from "src/domains/policyDirectory.entity";
import { PolicyDirectoryReadDto } from "src/contracts/policyDirectory/read-policyDirectory.dto";
import { PolicyDirectoryUpdateDto } from "src/contracts/policyDirectory/update-policyDirectory.dto";

@ApiTags('PolicyDirectories')
@Controller(':userId/policyDirectory')
export class PolicyDirectoryController{
    constructor(
        private readonly policyDirectoryService: PolicyDirectoryService,
        private readonly userService: UsersService,
        @Inject('winston') private readonly logger: Logger,
    ){

    }

    @Get()
    @ApiOperation({ summary: 'Все папки' })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<PolicyDirectoryReadDto[]>{
        const user = await this.userService.findOne(userId, ['account']);
        const policyDirectories = await this.policyDirectoryService.findAllForAccount(user.account, ['policyToPolicyDirectories.policy']);
        return policyDirectories;
    }

    @Post('new')
    @ApiOperation({summary: 'Создать папку для политик'})
    @ApiBody({
        description: 'ДТО для создания папки',
        type: PolicyDirectoryCreateDto,
        required: true,
    })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async create(@Param('userId') userId: string, @Body() policyDirectoryCreateDto: PolicyDirectoryCreateDto, @Ip() ip: string): Promise<{id: string}>{
        const user = await this.userService.findOne(userId, ['account']);
        policyDirectoryCreateDto.account = user.account;
        const createdPolicyDirectory = await this.policyDirectoryService.create(policyDirectoryCreateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - policyDirectoryCreateDto: ${JSON.stringify(policyDirectoryCreateDto)} - Создана новая папка!`)
        return {id: createdPolicyDirectory.id};
    }

    @Patch(':policyDirectoryId/update')
    @ApiOperation({summary: 'Обновить папку для политик'})
    @ApiBody({
        description: 'ДТО для обновления папки',
        type: PolicyDirectoryUpdateDto,
        required: true,
    })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'policyDirectoryId', required: true, description: 'Id папки', example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988' })
    async update(@Param('policyDirectoryId') policyDirectoryId: string, @Body() policyDirectoryUpdateDto: PolicyDirectoryUpdateDto, @Ip() ip: string): Promise<{id: string}>{
        const updatedPolicyDirectory = await this.policyDirectoryService.update(policyDirectoryId, policyDirectoryUpdateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED POLICYDIRECTORY: ${JSON.stringify(policyDirectoryUpdateDto)} - Папка успешно обновлена!`);
        return {id: updatedPolicyDirectory.id};
    }


    @Delete(':policyDirectoryId/remove')
    @ApiOperation({summary: 'Обновить папку для политик'})
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'policyDirectoryId', required: true, description: 'Id папки', example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988' })
    async remove(@Param('policyDirectoryId') policyDirectoryId: string, @Ip() ip: string): Promise<void>{
        return await this.policyDirectoryService.remove(policyDirectoryId);
    }
}