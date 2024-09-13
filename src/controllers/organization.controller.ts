import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { UsersService } from "src/application/services/users/users.service";
import { OrganizationCreateDto } from "src/contracts/organization/create-organization.dto";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Organization')
@Controller(':userId/organizations')
export class OrganizationController{
    constructor(
        private readonly organizationService: OrganizationService,
        private readonly userService: UsersService
    ){}
    
    
    @Get()
    async findOrganization(): Promise<OrganizationReadDto[]>{
        return await this.organizationService.findAll();
    }

    @Post('new')
    async create(@Param('userId') userId: string, @Body() organizationCreateDto: OrganizationCreateDto): Promise<OrganizationCreateDto>{
        const user = await this.userService.findOne(userId)
        organizationCreateDto.account = user.account;

        return await this.organizationService.create(organizationCreateDto);
    }
}