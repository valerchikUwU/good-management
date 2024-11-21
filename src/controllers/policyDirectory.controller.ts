import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Ip,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PolicyDirectoryService } from 'src/application/services/policyDirectory/policyDirectory.service';
import { UsersService } from 'src/application/services/users/users.service';
import { PolicyDirectoryCreateDto } from 'src/contracts/policyDirectory/create-policyDirectory.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PolicyDirectory } from 'src/domains/policyDirectory.entity';
import { PolicyDirectoryReadDto } from 'src/contracts/policyDirectory/read-policyDirectory.dto';
import { PolicyDirectoryUpdateDto } from 'src/contracts/policyDirectory/update-policyDirectory.dto';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { Type } from 'src/domains/policy.entity';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';

@ApiTags('PolicyDirectories')
@Controller(':userId/policyDirectory')
export class PolicyDirectoryController {
  constructor(
    private readonly policyDirectoryService: PolicyDirectoryService,
    private readonly userService: UsersService,
    private readonly policyService: PolicyService,
    @Inject('winston') private readonly logger: Logger,
  ) {}


  @Get()
  @ApiOperation({ summary: 'Все папки' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<PolicyDirectoryReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    const policyDirectories =
      await this.policyDirectoryService.findAllForAccount(user.account, [
        'policyToPolicyDirectories.policy',
      ]);
    return policyDirectories;
  }


  
  
  @Get(':policyDirectoryId')
  @ApiOperation({ summary: 'Получить папку по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      policyDirectory: {
        id: "2dd05cab-f048-4e3c-a728-7f2ba5d546d5",
        directoryName: "Папка №2",
        policyToPolicyDirectories: [
          {
            id: "a8a9906e-8638-41b7-9692-95820c962484",
            createdAt: "2024-11-20T14:04:28.692Z",
            updatedAt: "2024-11-20T14:04:28.692Z",
            policy: {
              id: "2c6a7bc4-4b7b-4822-af9f-5dfd0be46c49",
              policyName: "Политика 2",
              policyNumber: 113,
              state: "Черновик",
              type: "Директива",
              dateActive: null,
              content: "<p>Политика 2</p>\n",
              createdAt: "2024-11-20T09:34:01.196Z",
              updatedAt: "2024-11-20T09:34:01.196Z"
            }
          }
        ]
      },
      instructions: [
        {
          id: "6565c6df-a2eb-4f4f-9e7a-4f7aba3331a5",
          policyName: "Инструкция 1",
          policyNumber: 127,
          state: "Активный",
          type: "Инструкция",
          dateActive: "2024-11-21T12:37:44.611Z",
          content: "<p>Инструкция 1</p>\n",
          createdAt: "2024-11-21T12:37:44.860Z",
          updatedAt: "2024-11-21T12:37:44.860Z"
        }
      ],
      directives: [
        {
          id: "b86e3c85-c2ce-4918-be74-850e5ae3e2c2",
          policyName: "Политика",
          policyNumber: 112,
          state: "Активный",
          type: "Директива",
          dateActive: "2024-11-20T11:35:38.352Z",
          content: "HTML контент (любая строка пройдет)",
          createdAt: "2024-11-20T09:33:48.863Z",
          updatedAt: "2024-11-20T12:34:57.928Z"
        }
      ]
    },
  })  
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Папка не найдена!` })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({
    name: 'policyDirectoryId',
    required: true,
    description: 'Id папки'
  })
  async findOne(@Param('userId') userId: string, @Param('policyDirectoryId') policyDirectoryId: string, @Ip() ip: string): Promise<{policyDirectory: PolicyDirectoryReadDto, directives: PolicyReadDto[], instructions: PolicyReadDto[]}> {
    const user = await this.userService.findOne(userId, ['account']);
    const [policyDirectory, policiesActive] = await Promise.all([
      this.policyDirectoryService.findOneById(policyDirectoryId, ['policyToPolicyDirectories.policy']),
      this.policyService.findAllActiveForAccount(user.account)
    ]) 
    const directives = policiesActive.filter((policy) => policy.type === Type.DIRECTIVE);
    const instructions = policiesActive.filter((policy) => policy.type === Type.INSTRUCTION);
    return {policyDirectory: policyDirectory, instructions: instructions, directives: directives};
  }



  @Post('new')
  @ApiOperation({ summary: 'Создать папку для политик' })
  @ApiBody({
    description: 'ДТО для создания папки',
    type: PolicyDirectoryCreateDto,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async create(@Param('userId') userId: string, @Body() policyDirectoryCreateDto: PolicyDirectoryCreateDto, @Ip() ip: string): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId, ['account']);
    policyDirectoryCreateDto.account = user.account;
    const createdPolicyDirectory = await this.policyDirectoryService.create(policyDirectoryCreateDto);
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - policyDirectoryCreateDto: ${JSON.stringify(policyDirectoryCreateDto)} - Создана новая папка!`,
    );
    return { id: createdPolicyDirectory.id };
  }

  @Patch(':policyDirectoryId/update')
  @ApiOperation({ summary: 'Обновить папку для политик' })
  @ApiBody({
    description: 'ДТО для обновления папки',
    type: PolicyDirectoryUpdateDto,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({
    name: 'policyDirectoryId',
    required: true,
    description: 'Id папки',
    example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988',
  })
  async update(
    @Param('policyDirectoryId') policyDirectoryId: string,
    @Body() policyDirectoryUpdateDto: PolicyDirectoryUpdateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const updatedPolicyDirectory = await this.policyDirectoryService.update(
      policyDirectoryId,
      policyDirectoryUpdateDto,
    );
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - UPDATED POLICYDIRECTORY: ${JSON.stringify(policyDirectoryUpdateDto)} - Папка успешно обновлена!`,
    );
    return { id: updatedPolicyDirectory.id };
  }

  @Delete(':policyDirectoryId/remove')
  @ApiOperation({ summary: 'Обновить папку для политик' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({
    name: 'policyDirectoryId',
    required: true,
    description: 'Id папки',
    example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988',
  })
  async remove(
    @Param('policyDirectoryId') policyDirectoryId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return await this.policyDirectoryService.remove(policyDirectoryId);
  }
}
