import { Body, Controller, Get, Inject, Ip, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { PolicyDirectoryService } from "src/application/services/policyDirectory/policyDirectory.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyDirectoryCreateDto } from "src/contracts/policyDirectory/create-policyDirectory.dto";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';
import { PolicyDirectory } from "src/domains/policyDirectory.entity";
import { PolicyDirectoryReadDto } from "src/contracts/policyDirectory/read-policyDirectory.dto";

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
        const user = await this.userService.findOne(userId);
        const policyDirectories = await this.policyDirectoryService.findAllForAccount(user.account);
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
    async create(@Param('userId') userId: string, @Body() policyDirectoryCreateDto: PolicyDirectoryCreateDto, @Ip() ip: string): Promise<PolicyDirectory>{
        const user = await this.userService.findOne(userId);
        policyDirectoryCreateDto.account = user.account;
        const createdPolicyDirectory = await this.policyDirectoryService.create(policyDirectoryCreateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - policyDirectoryCreateDto: ${JSON.stringify(policyDirectoryCreateDto)} - Создана новая папка!`)
        return createdPolicyDirectory;
    }
}