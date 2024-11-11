import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpStatus,
  Patch,
  Ip,
  Inject,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleService } from 'src/application/services/role/role.service';
import { RoleSettingService } from 'src/application/services/roleSetting/roleSetting.service';
import { RoleSettingCreateDto } from 'src/contracts/roleSetting/create-roleSetting.dto';
import { RoleSettingReadDto } from 'src/contracts/roleSetting/read-roleSetting.dto';
import { RoleSettingUpdateDto } from 'src/contracts/roleSetting/update-roleSetting.dto';
import { RoleSetting } from 'src/domains/roleSetting.entity';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';

@ApiTags('RoleSettings')
@Controller(':userId/roleSettings')
export class RoleSettingController {
  constructor(
    private readonly roleSettingService: RoleSettingService,
    private readonly roleService: RoleService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Найти все настройки ролей' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '253a5f99-376b-4774-b118-ca151d2685ca',
        module: 'policy',
        can_read: false,
        can_create: false,
        can_update: false,
        createdAt: '2024-10-02T15:09:17.689Z',
        updatedAt: '2024-10-02T15:09:17.689Z',
        role: {
          id: '675a797e-d0f2-4907-bad5-25733c3e2380',
          roleName: 'Админ',
          createdAt: '2024-10-02T15:08:12.652Z',
          updatedAt: '2024-10-02T15:08:12.652Z',
        },
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async findAll(): Promise<RoleSettingReadDto[]> {
    return await this.roleSettingService.findAll();
  }

  @Patch('update')
  @ApiOperation({ summary: 'Обновить все настройки доступа' })
  @ApiBody({
    description: 'ДТО для обновления настроек доступа',
    type: RoleSettingUpdateDto,
    isArray: true,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {},
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async update(
    @Body() updateRoleSettingDtos: RoleSettingUpdateDto[],
  ): Promise<RoleSettingReadDto[]> {
    const updatedRoleSettingsPromises = updateRoleSettingDtos.map(
      async (updateRoleSettingDto) => {
        const savedRoleSetting = await this.roleSettingService.update(
          updateRoleSettingDto.id,
          updateRoleSettingDto,
        );
        return savedRoleSetting;
      },
    );

    const updatedRoleSettings = await Promise.all(updatedRoleSettingsPromises);

    return updatedRoleSettings;
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать настройку доступа для роли' })
  @ApiBody({
    description: 'ДТО для создания настройки',
    type: RoleSettingCreateDto,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async create(
    @Param('userId') userId: string,
    @Body() roleSettingCreateDto: RoleSettingCreateDto,
    @Ip() ip: string,
  ): Promise<RoleSetting> {
    const role = await this.roleService.findOneById(
      roleSettingCreateDto.roleId,
    );
    roleSettingCreateDto.role = role;
    const createdRule =
      await this.roleSettingService.create(roleSettingCreateDto);
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - roleSettingCreateDto: ${JSON.stringify(roleSettingCreateDto)} - Создана настройка!`,
    );
    return createdRule;
  }
}
