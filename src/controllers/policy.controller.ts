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
export class PolicyController {
    constructor(
        private readonly policyService: PolicyService,
        private readonly userService: UsersService,
        private readonly organizationService: OrganizationService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все политики' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(@Param('userId') userId: string): Promise<PolicyReadDto[]> {
        const user = await this.userService.findOne(userId)
        const policies = await this.policyService.findAllForAccount(user.account);
        return policies
    }

    

    @Get('new')
    @ApiOperation({ summary: 'Получить данные для создания новой политики' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async beforeCreate(@Param('userId') userId: string): Promise<{ directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[], organizations: OrganizationReadDto[] }> {
        const user = await this.userService.findOne(userId)
        const directives = await this.policyService.findDirectivesForAccount(user.account);
        const instructions = await this.policyService.findInstructionsForAccount(user.account);
        const organizations = await this.organizationService.findAllForAccount(user.account);
        const policies = await this.policyService.findAllForAccount(user.account)

        return { directives: directives, instructions: instructions, policies: policies, organizations: organizations }
    }

    @Get(':policyId')
    @ApiOperation({ summary: 'Получить политику по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
    async findOne(@Param('userId') userId: string, policyId: string): Promise<{ currentPolicy: PolicyReadDto, directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[] }> {
        const user = await this.userService.findOne(userId)
        const policy = await this.policyService.findeOneById(policyId);
        const directives = await this.policyService.findDirectivesForAccount(user.account);
        const instructions = await this.policyService.findInstructionsForAccount(user.account);
        const policies = await this.policyService.findAllForAccount(user.account)

        return { currentPolicy: policy, directives: directives, instructions: instructions, policies: policies }
    }






    @Post('new')
    @ApiOperation({ summary: 'Создать политику' })
    @ApiBody({
        description: 'ДТО для создания политики',
        type: PolicyCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            

            policyName: "Политика",
            state: "Черновик",
            type: "Директива",
            content: "HTML контент (любая строка пройдет)",
            user: {
                id: "3b809c42-2824-46c1-9686-dd666403402a",
                firstName: "Maxik",
                lastName: "Koval",
                telegramId: 453120600,
                telephoneNumber: null,
                avatar_url: null,
                vk_id: null,
                createdAt: "2024-09-16T14:03:31.000Z",
                updatedAt: "2024-09-16T14:03:31.000Z",
                organization: {
                    id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
                    organizationName: "soplya firma",
                    parentOrganizationId: null,
                    createdAt: "2024-09-16T14:24:33.841Z",
                    updatedAt: "2024-09-16T14:24:33.841Z"
                },
                account: {
                    id: "a1118813-8985-465b-848e-9a78b1627f11",
                    accountName: "OOO PIPKA",
                    createdAt: "2024-09-16T12:53:29.593Z",
                    updatedAt: "2024-09-16T12:53:29.593Z"
                }
            },
            account: {
                id: "a1118813-8985-465b-848e-9a78b1627f11",
                accountName: "OOO PIPKA",
                createdAt: "2024-09-16T12:53:29.593Z",
                updatedAt: "2024-09-16T12:53:29.593Z"
            },
            dateActive: null,
            id: "71ba1ba2-9e53-4238-9bb2-14a475460689",
            policyNumber: 7,
            createdAt: "2024-09-18T15:12:21.377Z",
            updatedAt: "2024-09-18T15:12:21.377Z"

        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    async create(@Param('userId') userId: string, @Body() policyCreateDto: PolicyCreateDto): Promise<Policy> {
        const user = await this.userService.findOne(userId);
        policyCreateDto.user = user;
        policyCreateDto.account = user.account;
        return await this.policyService.create(policyCreateDto)
    }

}