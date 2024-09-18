import { Controller, Get, HttpStatus, Param, Body, Post } from "@nestjs/common";
import { PolicyService } from "src/application/services/policy/policy.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";


import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { Policy } from "src/domains/policy.entity";

@ApiTags('Policy')
@Controller(':userId/policies')
export class PolicyController{
    constructor(
        private readonly policyService: PolicyService,
        private readonly userService: UsersService
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
        return await this.policyService.findAll()
    }


    @Get(':policyId')
    async findOne(@Param('userId') userId: string, policyId: string): Promise<{currentPolicy: PolicyReadDto, directives: PolicyReadDto[], instructions: PolicyReadDto[], policies: PolicyReadDto[]}>{
        const policy = await this.policyService.findeOneById(policyId);
        const directives = await this.policyService.findDirectives();
        const instructions = await this.policyService.findInstructions();

        const policies = await this.policyService.findAll()

        return {currentPolicy: policy, directives: directives, instructions: instructions, policies: policies}
    }

    

    @Post('new')
    @ApiOperation({ summary: 'Создать политику' })
    @ApiBody({
        description: 'ДТО для создания политики',
        type: PolicyCreateDto,
        required: true,
    })
    async create(@Param('userId') userId: string, @Body() policyCreateDto: PolicyCreateDto): Promise<Policy>{
        const user = await this.userService.findOne(userId);
        policyCreateDto.user = user;
        policyCreateDto.account = user.account;
        return await this.policyService.create(policyCreateDto)
    }

}