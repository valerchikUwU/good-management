import { Controller, Get, Param } from "@nestjs/common";
import { PolicyService } from "src/application/services/policy/policy.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Policy')
@Controller(':userId/policies')
export class PolicyController{
    constructor(
        private readonly policyService: PolicyService,
        private readonly userService: UsersService
    )
    {}

    @Get()
    async findAll(@Param() userId: string): Promise<PolicyReadDto[]>{
        return await this.policyService.findAll()
    }
}