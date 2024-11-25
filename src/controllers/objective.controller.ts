import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Ip,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectiveService } from 'src/application/services/objective/objective.service';
import { StrategyService } from 'src/application/services/strategy/strategy.service';
import { UsersService } from 'src/application/services/users/users.service';
import { ObjectiveCreateDto } from 'src/contracts/objective/create-objective.dto';
import { ObjectiveReadDto } from 'src/contracts/objective/read-objective.dto';
import { ObjectiveUpdateDto } from 'src/contracts/objective/update-objective.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { StrategyReadDto } from 'src/contracts/strategy/read-strategy.dto';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { ObjectiveCreateEventDto } from 'src/contracts/objective/createEvent-objective.dto';
import { ObjectiveUpdateEventDto } from 'src/contracts/objective/updateEvent-objective.dto';
import { TimeoutError } from 'rxjs';

@ApiTags('Objective')
@Controller(':userId/objectives')
export class ObjectiveController {
  constructor(
    private readonly objectiveService: ObjectiveService,
    private readonly userService: UsersService,
    private readonly strategyService: StrategyService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Все краткосрочные цели' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '59fd156c-9a24-43f5-a521-2e9c888cca2c',
        situation: ['Текст'],
        content: ['Контент'],
        rootCause: ['Причина'],
        createdAt: '2024-10-31T15:11:47.146Z',
        updatedAt: '2024-10-31T15:11:47.146Z',
      },
    ],
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
  async findAll(
    @Param('userId') userId: string,
    @Ip() ip: string,
  ): Promise<ObjectiveReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    const objectives = await this.objectiveService.findAllForAccount(
      user.account,
      ['strategy'],
    );
    return objectives;
  }

  @Get('new')
  @ApiOperation({
    summary: 'Получить данные для создания новой краткосрочной цели',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '2a72e4ed-9d95-4a10-8223-4a201a5d6f2e',
        strategyNumber: 3,
        dateActive: null,
        content: 'HTML текст',
        state: 'Активный',
        createdAt: '2024-09-26T15:33:30.985Z',
        updatedAt: '2024-09-26T15:33:30.985Z',
      },
    ],
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
  async beforeCreate(
    @Param('userId') userId: string,
    @Ip() ip: string,
  ): Promise<StrategyReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    const strategies =
      await this.strategyService.findAllActiveOrDraftWithoutObjectiveForAccount(
        user.account,
      );
    return strategies;
  }

  @Get('update')
  @ApiOperation({
    summary: 'Получить данные для обновления краткосрочной цели по ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '3dea05a6-eba2-482a-b8bb-7f80bdcbc9c2',
        strategyNumber: 81,
        dateActive: null,
        content: 'HTML текст',
        state: 'Активный',
        createdAt: '2024-10-29T18:43:46.953Z',
        updatedAt: '2024-10-31T15:10:08.283Z',
        objective: {
          id: '59fd156c-9a24-43f5-a521-2e9c888cca2c',
          situation: ['Текст'],
          content: ['Контент'],
          rootCause: ['Причина'],
          createdAt: '2024-10-31T15:11:47.146Z',
          updatedAt: '2024-10-31T15:11:47.146Z',
        },
      },
    ],
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
  async beforeUpdate(
    @Param('userId') userId: string,
  ): Promise<StrategyReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    const strategies =
      await this.strategyService.findAllActiveWithObjectiveForAccount(
        user.account,
      );
    return strategies;
  }

  @Patch(':objectiveId/update')
  @ApiOperation({ summary: 'Обновить краткосрочную цель по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: '0a2f6024-e6f7-49b9-a008-70665bd36881',
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
  @ApiParam({
    name: 'objectiveId',
    required: true,
    description: 'Id краткосрочной цели',
  })
  async update(
    @Param('userId') userId: string,
    @Param('objectiveId') objectiveId: string,
    @Body() objectiveUpdateDto: ObjectiveUpdateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId, ['account']);
    if (objectiveUpdateDto.strategyId) {
      const strategy = await this.strategyService.findOneById(
        objectiveUpdateDto.strategyId,
        ['organization'],
      );
      objectiveUpdateDto.strategy = strategy;
    }
    const updatedObjectiveId = await this.objectiveService.update(
      objectiveId,
      objectiveUpdateDto,
    );
    const updatedEventObjectiveDto: ObjectiveUpdateEventDto = {
      eventType: 'OBJECTIVE_UPDATED',
      id: updatedObjectiveId,
      situation:
        objectiveUpdateDto.situation !== undefined
          ? objectiveUpdateDto.situation
          : null,
      content:
        objectiveUpdateDto.content !== undefined
          ? objectiveUpdateDto.content
          : null,
      rootCause:
        objectiveUpdateDto.rootCause !== undefined
          ? objectiveUpdateDto.rootCause
          : null,
      updatedAt: new Date(),
      strategyId:
        objectiveUpdateDto.strategyId !== undefined
          ? objectiveUpdateDto.strategyId
          : null,
      accountId: user.account.id,
    };
    try {
      await Promise.race([
        this.producerService.sendUpdatedObjectiveToQueue(
          updatedEventObjectiveDto,
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new TimeoutError()), 5000),
        ),
      ]);
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error(
          `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
        );
      } else {
        this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
      }
    }
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - UPDATED OBJECTIVE: ${JSON.stringify(objectiveUpdateDto)} - Краткосрочная цель успешно обновлена!`,
    );
    return { id: updatedObjectiveId };
  }

  // @Post('new')
  // @ApiOperation({ summary: 'Создать краткосрочную цель' })
  // @ApiBody({
  //   description: 'ДТО для создания цели',
  //   type: ObjectiveCreateDto,
  //   required: true,
  // })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'ОК!',
  //   example: '2f17f491-03c4-4bf8-8e40-c741263ed9df',
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: 'Ошибка сервера!',
  // })
  // @ApiParam({
  //   name: 'userId',
  //   required: true,
  //   description: 'Id пользователя',
  //   example: '3b809c42-2824-46c1-9686-dd666403402a',
  // })
  // async create(
  //   @Param('userId') userId: string,
  //   @Body() objectiveCreateDto: ObjectiveCreateDto,
  //   @Ip() ip: string,
  // ): Promise<{id: string}> {
  //   const [user, chosenStrategy] = await Promise.all([
  //     this.userService.findOne(userId, ['account']),
  //     this.strategyService.findOneById(objectiveCreateDto.strategyId, [
  //       'organization',
  //     ]),
  //   ]);
  //   objectiveCreateDto.strategy = chosenStrategy;
  //   objectiveCreateDto.account = user.account;
  //   const createdObjectiveId = await this.objectiveService.create(objectiveCreateDto);
  //   const createdEventObjectiveDto: ObjectiveCreateEventDto = {
  //     eventType: 'OBJECTIVE_CREATED',
  //     id: createdObjectiveId,
  //     situation:
  //       objectiveCreateDto.situation !== undefined
  //         ? objectiveCreateDto.situation
  //         : null,
  //     content:
  //       objectiveCreateDto.content !== undefined
  //         ? objectiveCreateDto.content
  //         : null,
  //     rootCause:
  //       objectiveCreateDto.rootCause !== undefined
  //         ? objectiveCreateDto.rootCause
  //         : null,
  //     createdAt: new Date(),
  //     strategyId: chosenStrategy.id,
  //     accountId: user.account.id,
  //   };
  //   try {
  //     await Promise.race([
  //       this.producerService.sendCreatedObjectiveToQueue(
  //         createdEventObjectiveDto,
  //       ),
  //       new Promise((_, reject) =>
  //         setTimeout(() => reject(new TimeoutError()), 5000),
  //       ),
  //     ]);
  //   } catch (error) {
  //     if (error instanceof TimeoutError) {
  //       this.logger.error(
  //         `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
  //       );
  //     } else {
  //       this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
  //     }
  //   }
  //   this.logger.info(
  //     `${yellow('OK!')} - ${red(ip)} - objectiveCreateDto: ${JSON.stringify(objectiveCreateDto)} - Создана новая краткосрочная цель!`,
  //   );
  //   return {id: createdObjectiveId};
  // }

  @Get(':strategyId')
  @ApiOperation({ summary: 'Получить цель по ID стратегии' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '2f17f491-03c4-4bf8-8e40-c741263ed9df',
      orderNumber: 1,
      situation: 'Текст',
      content: 'Контент',
      rootCause: 'Причина',
      createdAt: '2024-09-20T14:58:53.054Z',
      updatedAt: '2024-09-20T14:58:53.054Z',
    },
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
  @ApiParam({ name: 'strategyId', required: true, description: 'Id стратегии' })
  async findOne(
    @Param('userId') userId: string,
    @Param('strategyId') strategyId: string,
    @Ip() ip: string,
  ): Promise<ObjectiveReadDto> {
    const objective = await this.objectiveService.findOneByStrategyId(
      strategyId,
      ['strategy'],
    );
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - CURRENT OBJECTIVE: ${JSON.stringify(objective)} - Получить краткосрочную цель по ID!`,
    );
    return objective;
  }
}
