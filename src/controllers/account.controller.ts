import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AccountService } from 'src/application/services/account/account.service';
import { AccountCreateDto } from 'src/contracts/account/create-account.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { RoleSettingService } from 'src/application/services/roleSetting/roleSetting.service';
import { RoleService } from 'src/application/services/role/role.service';

@ApiTags('Account')
@Controller(':userId/accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly producerService: ProducerService,
    private readonly roleSettingService: RoleSettingService,
    private readonly roleService: RoleService,
  ) {}

  @Get(':accountId')
  @ApiOperation({ summary: 'Найти аккаунт по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: 'a1118813-8985-465b-848e-9a78b1627f11',
      accountName: 'OOO PIPKA',
      createdAt: '2024-09-16T12:53:29.593Z',
      updatedAt: '2024-09-16T12:53:29.593Z',
      users: [
        {
          id: 'bc807845-08a8-423e-9976-4f60df183ae2',
          firstName: 'Maxik',
          lastName: 'Koval',
          telegramId: 453120600,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: '2024-09-16T14:03:31.000Z',
          updatedAt: '2024-09-16T14:03:31.000Z',
        },
      ],
      organizations: [
        {
          id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          organizationName: 'soplya firma',
          parentOrganizationId: null,
          createdAt: '2024-09-16T14:24:33.841Z',
          updatedAt: '2024-09-16T14:24:33.841Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async findUsersAccount(
    @Param('id') id: string,
  ): Promise<AccountReadDto | null> {
    return this.accountService.findOneById(id);
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать аккаунт' })
  @ApiBody({
    description: 'ДТО для создания аккаунта',
    type: AccountCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '1c64b108-5023-4a76-a3ba-2b1657ed0c9f',
      accountName: 'ООО Группа',
      createdAt: '1900-01-01 00:00:00',
      updatedAt: '1900-01-01 00:00:00',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async create(
    @Body() accountCreateDto: AccountCreateDto,
  ): Promise<AccountCreateDto> {
    const newAccount = await this.accountService.create(accountCreateDto);
    const roles = await this.roleService.findAll();
    await this.roleSettingService.createAllForAccount(newAccount, roles);
    return newAccount;
  }
}
