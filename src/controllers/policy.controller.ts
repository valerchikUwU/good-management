import { Controller, Get, HttpStatus, Param, Body, Post, Inject, Ip, InternalServerErrorException, NotFoundException, Patch } from "@nestjs/common";
import { PolicyService } from "src/application/services/policy/policy.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { Policy } from "src/domains/policy.entity";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PolicyUpdateDto } from "src/contracts/policy/update-policy.dto";

@ApiTags('Policy')
@Controller(':userId/policies')
export class PolicyController {
    constructor(
        private readonly policyService: PolicyService,
        private readonly userService: UsersService,
        private readonly organizationService: OrganizationService,
        @Inject('winston') private readonly logger: Logger,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все политики' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example:
            [
                {
                    id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
                    policyName: "asdasd",
                    policyNumber: 1,
                    state: "Черновик",
                    type: "Директива",
                    dateActive: null,
                    content: "string",
                    createdAt: "2024-09-18T14:59:47.010Z",
                    updatedAt: "2024-09-18T14:59:47.010Z"
                },
                {
                    id: "f6e3ac1f-afd9-42c1-a9f3-d189961c325c",
                    policyName: "Пипка",
                    policyNumber: 2,
                    state: "Черновик",
                    type: "Директива",
                    dateActive: null,
                    content: "попа",
                    createdAt: "2024-09-18T15:06:52.222Z",
                    updatedAt: "2024-09-18T15:06:52.222Z"
                }
            ]

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<PolicyReadDto[]> {
        const user = await this.userService.findOne(userId);
        const policies = await this.policyService.findAllForAccount(user.account);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - POLICIES: ${JSON.stringify(policies)} - ВСЕ ПОЛИТИКИ!`);
        return policies
    }






    @Get('new')
    @ApiOperation({ summary: 'Получить данные для создания новой политики' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {

            directives: [
                {
                    id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
                    policyName: "asdasd",
                    policyNumber: 1,
                    state: "Черновик",
                    type: "Директива",
                    dateActive: null,
                    content: "string",
                    createdAt: "2024-09-18T14:59:47.010Z",
                    updatedAt: "2024-09-18T14:59:47.010Z"
                }
            ],
            instructions: [],
            policies: [
                {
                    id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
                    policyName: "asdasd",
                    policyNumber: 1,
                    state: "Черновик",
                    type: "Директива",
                    dateActive: null,
                    content: "string",
                    createdAt: "2024-09-18T14:59:47.010Z",
                    updatedAt: "2024-09-18T14:59:47.010Z",
                    account: {
                        id: "a1118813-8985-465b-848e-9a78b1627f11",
                        accountName: "OOO PIPKA",
                        createdAt: "2024-09-16T12:53:29.593Z",
                        updatedAt: "2024-09-16T12:53:29.593Z"
                    }
                }
            ],
            organizations: [
                {
                    id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
                    organizationName: "soplya firma",
                    parentOrganizationId: null,
                    createdAt: "2024-09-16T14:24:33.841Z",
                    updatedAt: "2024-09-16T14:24:33.841Z"
                },
                {
                    id: "1f1cca9a-2633-489c-8f16-cddd411ff2d0",
                    organizationName: "OOO BOBRIK",
                    parentOrganizationId: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
                    createdAt: "2024-09-16T15:09:48.995Z",
                    updatedAt: "2024-09-16T15:09:48.995Z"
                }
            ]
        }

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<{ directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[], organizations: OrganizationReadDto[] }> {
        const user = await this.userService.findOne(userId)
        const directives = await this.policyService.findDirectivesForAccount(user.account);
        const instructions = await this.policyService.findInstructionsForAccount(user.account);
        const organizations = await this.organizationService.findAllForAccount(user.account);
        const policies = await this.policyService.findAllForAccount(user.account)

        this.logger.info(`${yellow('OK!')} - ${red(ip)} - DIRECTIVES: ${JSON.stringify(directives)} - INSTRUCTIONS: ${JSON.stringify(instructions)} - ORGANIZATIONS: ${JSON.stringify(organizations)} - POLICIES: ${JSON.stringify(policies)} - Получить данные для создания новой политики!`);
        return { directives: directives, instructions: instructions, policies: policies, organizations: organizations }
    }


    @Patch(':policyId/update')
    @ApiOperation({ summary: 'Обновить политику по Id' })
    @ApiBody({
        description: 'ДТО для обновления политики',
        type: PolicyUpdateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
            policyName: "только название",
            policyNumber: 1,
            state: "Черновик",
            type: "Инструкция",
            dateActive: null,
            content: "HTML",
            createdAt: "2024-09-18T14:59:47.010Z",
            updatedAt: "2024-09-20T11:51:20.848Z"
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Политика не найдена!` })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
    async update(@Param('policyId') policyId: string, @Body() policyUpdateDto: PolicyUpdateDto, @Ip() ip: string): Promise<PolicyReadDto> {
        const updatedPolicy = await this.policyService.update(policyId, policyUpdateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED POLICY: ${JSON.stringify(policyUpdateDto)} - Политика успешно обновлена!`);
        return updatedPolicy;
    }

    @Get(':policyId')
    @ApiOperation({ summary: 'Получить политику по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            currentPolicy: {
                id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
                policyName: "asdasd",
                policyNumber: 1,
                state: "Черновик",
                type: "Директива",
                dateActive: null,
                content: "string",
                createdAt: "2024-09-18T14:59:47.010Z",
                updatedAt: "2024-09-18T14:59:47.010Z"
            },
            directives: [
                {
                    id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
                    policyName: "asdasd",
                    policyNumber: 1,
                    state: "Черновик",
                    type: "Директива",
                    dateActive: null,
                    content: "string",
                    createdAt: "2024-09-18T14:59:47.010Z",
                    updatedAt: "2024-09-18T14:59:47.010Z"
                }
            ],
            instructions: [],
            policies: [
                {
                    id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
                    policyName: "asdasd",
                    policyNumber: 1,
                    state: "Черновик",
                    type: "Директива",
                    dateActive: null,
                    content: "string",
                    createdAt: "2024-09-18T14:59:47.010Z",
                    updatedAt: "2024-09-18T14:59:47.010Z"
                }
            ]
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Политика не найдена!` })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiParam({ name: 'policyId', required: true, description: 'Id политики' })
    async findOne(@Param('userId') userId: string, @Param('policyId') policyId: string, @Ip() ip: string): Promise<{ currentPolicy: PolicyReadDto, directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[], organizations: OrganizationReadDto[] }> {
        const policy = await this.policyService.findeOneById(policyId);
        const user = await this.userService.findOne(userId)
        const directives = await this.policyService.findDirectivesForAccount(user.account);
        const instructions = await this.policyService.findInstructionsForAccount(user.account);
        const policies = await this.policyService.findAllForAccount(user.account);
        const organizations = await this.organizationService.findAllForAccount(user.account);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT POLICY: ${JSON.stringify(policy)} - Получить политику по ID!`);
        return { currentPolicy: policy, directives: directives, instructions: instructions, policies: policies, organizations: organizations }
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
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Ошибка валидации!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async create(@Param('userId') userId: string, @Body() policyCreateDto: PolicyCreateDto, @Ip() ip: string): Promise<Policy> {
        const user = await this.userService.findOne(userId);
        policyCreateDto.user = user;
        policyCreateDto.account = user.account;
        const createdPolicy = await this.policyService.create(policyCreateDto)
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - policyCreateDto: ${JSON.stringify(policyCreateDto)} - Создана новая политика!`)
        return createdPolicy;
    }
}