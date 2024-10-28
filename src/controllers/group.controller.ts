import { Controller, Get, HttpStatus, Param, Body, Post, Inject, Ip, InternalServerErrorException, NotFoundException, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "src/application/services/users/users.service";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { ModuleAccess } from "src/decorators/module-access.decorator";
import { ActionAccess } from "src/decorators/action-access.decorator";
import { Actions, Modules } from "src/domains/roleSetting.entity";
import { PermissionsGuard } from "src/guards/permission.guard";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { ProducerService } from "src/application/services/producer/producer.service";
import { GroupService } from "src/application/services/group/group.service";
import { GroupReadDto } from "src/contracts/group/read-group.dto";
import { GroupUpdateDto } from "src/contracts/group/update-group.dto";
import { GroupCreateDto } from "src/contracts/group/create-group.dto";

@ApiTags('Group')
// @UseGuards(AccessTokenGuard)
@Controller(':userId/groups')
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly organizationService: OrganizationService,
        private readonly userService: UsersService,
        @Inject('winston') private readonly logger: Logger,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все группы' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {}
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<GroupReadDto[]> {
        const user = await this.userService.findOne(userId);
        const groups = await this.groupService.findAllForAccount(user.account);
        return groups;
    }






    @Get('new')
    @ApiOperation({ summary: 'Получить данные для создания новой группы' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<OrganizationReadDto[]> {
        const user = await this.userService.findOne(userId)
        const organizations = await this.organizationService.findAllForAccountWithRelations(user.account);
        return organizations;
    }


    @Patch(':groupId/update')
    @ApiOperation({ summary: 'Обновить группу по Id' })
    @ApiBody({
        description: 'ДТО для обновления группы',
        type: GroupUpdateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: "3bfe46ff-a10b-4f55-a865-5ed478f4347d"
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Группа не найдена!` })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'groupId', required: true, description: 'Id группы' })
    async update(@Param('groupId') groupId: string, @Body() groupUpdateDto: GroupUpdateDto, @Ip() ip: string): Promise<string> {
        const updatedGroupId = await this.groupService.update(groupId, groupUpdateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - groupUpdateDto: ${JSON.stringify(groupUpdateDto)} - Группа успешно обновлена!`);
        return updatedGroupId;
    }

    @Get(':groupId')
    // @UseGuards(PermissionsGuard)
    // @ModuleAccess(Modules.POLICY)
    // @ActionAccess(Actions.READ)
    @ApiOperation({ summary: 'Получить группу по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Группа не найдена!` })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'groupId', required: true, description: 'Id группы' })
    async findOne(@Param('userId') userId: string, @Param('groupId') groupId: string, @Ip() ip: string): Promise<GroupReadDto> {
        const group = await this.groupService.findOneById(groupId);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT GROUP: ${JSON.stringify(group)} - Получить группу по ID!`);
        return group
    }






    @Post('new')
    @ApiOperation({ summary: 'Создать группу' })
    @ApiBody({
        description: 'ДТО для создания группы',
        type: GroupCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.CREATED, description: "ОК!",
        example: "71ba1ba2-9e53-4238-9bb2-14a475460689"
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Ошибка валидации!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async create(@Param('userId') userId: string, @Body() groupCreateDto: GroupCreateDto, @Ip() ip: string): Promise<string> {
        const user = await this.userService.findOne(userId);
        groupCreateDto.account = user.account;
        const createdGroupId = await this.groupService.create(groupCreateDto);
        // const createdEventPolicyDto: PolicyCreateEventDto = {
        //     eventType: 'POLICY_CREATED',
        //     id: createdPolicyId,
        //     policyName: policyCreateDto.policyName,
        //     state: policyCreateDto.state !== undefined ? policyCreateDto.state as string : State.DRAFT as string,
        //     type: policyCreateDto.type !== undefined ? policyCreateDto.type as string : Type.DIRECTIVE as string, 
        //     content: policyCreateDto.content, 
        //     createdAt: new Date(),
        //     userId: user.id,
        //     accountId: user.account.id,
        //     policyToOrganizations: policyCreateDto.policyToOrganizations
        // };
        // await this.producerService.sendCreatedPolicyToQueue(createdEventPolicyDto)
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - groupCreateDto: ${JSON.stringify(groupCreateDto)} - Создана новая группа!`)
        return createdGroupId;
    }
}