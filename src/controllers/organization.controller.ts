import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { UsersService } from "src/application/services/users/users.service";
import { OrganizationCreateDto } from "src/contracts/organization/create-organization.dto";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";


import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Organization')
@Controller(':userId/organizations')
export class OrganizationController{
    constructor(
        private readonly organizationService: OrganizationService,
        private readonly userService: UsersService
    ){}
    
    
    @Get()
    @ApiOperation({summary: 'Все организации'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!",
        example: {
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          ip: "192.168.1.100",
          token: "dd31cc25926db1b45f2e"
        }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async findOrganization(): Promise<OrganizationReadDto[]>{
        return await this.organizationService.findAll();
    }
    


    @Post('new')
    @ApiOperation({summary: 'Добавить организацию'})
    @ApiResponse({ status: HttpStatus.OK, description: "ОК!", example: {
        organizationName: "soplya firma",
        parentOrganizationId: null,
        account: {
          id: "a1118813-8985-465b-848e-9a78b1627f11",
          accountName: "OOO PIPKA",
          createdAt: "2024-09-16T12:53:29.593Z",
          updatedAt: "2024-09-16T12:53:29.593Z"
        },
        id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
        createdAt: "2024-09-16T14:24:33.841Z",
        updatedAt: "2024-09-16T14:24:33.841Z"
      }})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!"})
    @ApiParam({name: 'userId', required: true, description: 'Id пользователя'})
    async create(@Param('userId') userId: string, @Body() organizationCreateDto: OrganizationCreateDto): Promise<OrganizationCreateDto>{
        const user = await this.userService.findOne(userId)
        organizationCreateDto.account = user.account;
        return await this.organizationService.create(organizationCreateDto);
    }
}