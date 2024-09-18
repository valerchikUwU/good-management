import { Controller, Get, HttpStatus, Param, Body, Post } from "@nestjs/common";
import { PolicyService } from "src/application/services/policy/policy.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";


import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { Policy } from "src/domains/policy.entity";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";

@ApiTags('Policy')
@Controller(':userId/policies')
export class PolicyController{
    constructor(
        private readonly policyService: PolicyService,
        private readonly userService: UsersService,
        private readonly organizationService: OrganizationService
    )
    {}

    @Get()
    @ApiOperation({summary: 'Все политики'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findAll(@Param('userId') userId: string): Promise<PolicyReadDto[]>{
        const user = await this.userService.findOne(userId)
        return await this.policyService.findAllForAccount(user.account)
    }


    @Get(':policyId')
    @ApiOperation({summary: 'Получить политику по ID'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    @ApiParam({name: 'policyId', required: true, description: 'Id политики'})
    async findOne(@Param('userId') userId: string, policyId: string): Promise<{currentPolicy: PolicyReadDto, directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[]}>{
        const user = await this.userService.findOne(userId)
        const policy = await this.policyService.findeOneById(policyId);
        const directives = await this.policyService.findDirectivesForAccount(user.account);
        const instructions = await this.policyService.findInstructionsForAccount(user.account);
        const policies = await this.policyService.findAllForAccount(user.account)

        return {currentPolicy: policy, directives: directives, instructions: instructions, policies: policies}
    }



    @Get('new')
    @ApiOperation({summary: 'Получить данные для создания новой политики'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async beforeCreate(@Param('userId') userId: string): Promise<{directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[], organizations: OrganizationReadDto[]}>{
        const user = await this.userService.findOne(userId)
        const directives = await this.policyService.findDirectivesForAccount(user.account);
        const instructions = await this.policyService.findInstructionsForAccount(user.account);
        const organizations = await this.organizationService.findAllForAccount(user.account);
        const policies = await this.policyService.findAllForAccount(user.account)

        return {directives: directives, instructions: instructions, policies: policies, organizations: organizations}
    }


    

    @Post('new')
    @ApiOperation({ summary: 'Создать политику' })
    @ApiBody({
        description: 'ДТО для создания политики',
        type: PolicyCreateDto,
        required: true,
    })
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    async create(@Param('userId') userId: string, @Body() policyCreateDto: PolicyCreateDto): Promise<Policy>{
        const user = await this.userService.findOne(userId);
        policyCreateDto.user = user;
        policyCreateDto.account = user.account;
        return await this.policyService.create(policyCreateDto)
    }

}