import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StatisticService } from 'src/application/services/statistic/statistic.service';
import { StatisticReadDto } from 'src/contracts/statistic/read-statistic.dto';
import { StatisticCreateDto } from 'src/contracts/statistic/create-statistic.dto';
import { Statistic, Type } from 'src/domains/statistic.entity';
import { StatisticDataService } from 'src/application/services/statisticData/statisticData.service';
import { PostService } from 'src/application/services/post/post.service';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { StatisticUpdateDto } from 'src/contracts/statistic/update-statistic.dto';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { StatisticDataCreateEventDto } from 'src/contracts/statisticData/createEvent-statisticData.dto';
import { StatisticCreateEventDto } from 'src/contracts/statistic/createEvent-statistic.dto';
import { StatisticDataUpdateEventDto } from 'src/contracts/statisticData/updateEvent-statisticData.dto';
import { StatisticUpdateEventDto } from 'src/contracts/statistic/updateEvent-statistic.dto';
import { TimeoutError } from 'rxjs';
import { StatisticUpdateBulkDto } from 'src/contracts/statistic/updateBulk_statistic.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request as ExpressRequest } from 'express';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseGuards(AccessTokenGuard)
@ApiTags('Statistic')
@ApiBearerAuth('access-token')
@Controller('statistics')
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService,
    private readonly statisticDataService: StatisticDataService,
    private readonly postService: PostService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get(':organizationId')
  @ApiOperation({ summary: 'Все статистики в организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        "id": "625b007f-2215-48b8-94aa-194e74d94eb4",
        "type": "Прямая",
        "name": "Статистика",
        "description": "fdgdfgdf",
        "createdAt": "2024-12-05T20:45:13.931Z",
        "updatedAt": "2024-12-17T14:42:01.999Z",
        "statisticDatas": [
          {
            "id": "edbc1605-e809-45ec-b3dc-7edaba26e789",
            "value": 200,
            "valueDate": "2024-12-13T00:00:00.000Z",
            "isCorrelation": false,
            "createdAt": "2024-12-05T20:45:14.070Z",
            "updatedAt": "2024-12-05T20:45:14.070Z"
          }
        ],
        "post": {
          "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "postName": "Post",
          "divisionName": "Подразделение №69",
          "divisionNumber": 69,
          "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
          "product": "fasf",
          "purpose": "sfsf",
          "createdAt": "2024-12-05T20:28:06.763Z",
          "updatedAt": "2024-12-05T20:28:06.763Z"
        }
      },
      {
        "id": "1aa4399e-671c-44ee-bad3-2f01554c7f0a",
        "type": "Прямая",
        "name": "Статистика2",
        "description": "gg",
        "createdAt": "2024-12-05T20:47:26.358Z",
        "updatedAt": "2024-12-17T15:48:12.579Z",
        "statisticDatas": [
          {
            "id": "5487fa08-7e6f-44b8-a5ca-9d7dcdbbb022",
            "value": 200,
            "valueDate": "2024-12-06T00:00:00.000Z",
            "isCorrelation": false,
            "createdAt": "2024-12-05T20:47:26.475Z",
            "updatedAt": "2024-12-05T20:47:26.475Z"
          }
        ],
        "post": {
          "id": "993b64bc-1703-415a-89a9-6e191b3d46bb",
          "postName": "asdsads",
          "divisionName": "Подразделение №65",
          "divisionNumber": 65,
          "parentId": null,
          "product": "asd",
          "purpose": "sadsad",
          "createdAt": "2024-12-04T15:12:11.525Z",
          "updatedAt": "2024-12-05T19:54:57.861Z"
        }
      },
    ]
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'Id организации',
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167'
  })
  @ApiQuery({
    name: 'statisticData',
    required: false,
    description: 'Флаг для отправки доп. данных (точек)',
    example: true,
  })
  async findAll(
    @Query('statisticData') statisticData: boolean,
    @Param('organizationId') organizationId: string
  ): Promise<StatisticReadDto[]> {
    let relations: string[]
    if (statisticData) {
      relations = ['statisticDatas', 'post']
    }
    else {
      relations = ['post']
    }
    return await this.statisticService.findAllForOrganization(organizationId, relations);
  }

  @Patch(':statisticId/update')
  @ApiOperation({ summary: 'Обновить статистику' })
  @ApiBody({
    description: 'ДТО для обновления статистики',
    type: StatisticUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: { "id": "ed2dfe55-b678-4f7e-a82e-ccf395afae05" },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресурс не найден!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'statisticId',
    required: true,
    description: 'Id статистики',
  })
  async update(
    @Req() req: ExpressRequest,
    @Param('statisticId') statisticId: string,
    @Body() statisticUpdateDto: StatisticUpdateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const statisticDataCreateEventDtos: StatisticDataCreateEventDto[] = [];
    const statisticDataUpdateEventDtos: StatisticDataUpdateEventDto[] = [];
    const post =
      statisticUpdateDto.postId !== undefined
        ? await this.postService.findOneById(statisticUpdateDto.postId)
        : null;
    if (post !== null) {
      statisticUpdateDto.post = post;
    }
    const updatedStatisticId = await this.statisticService.update(
      statisticId,
      statisticUpdateDto,
    );
    const statistic = await this.statisticService.findOneById(updatedStatisticId);
    if (statisticUpdateDto.statisticDataUpdateDtos !== undefined) {
      const updateStatisticDataPromises = statisticUpdateDto.statisticDataUpdateDtos.map(
        async (statisticDataUpdateDto) => {
          const updatedStatisticDataId = await this.statisticDataService.update(statisticDataUpdateDto);
          const statisticDataUpdateEventDto: StatisticDataUpdateEventDto = {
            id: updatedStatisticDataId,
            value:
              statisticDataUpdateDto.value !== undefined
                ? statisticDataUpdateDto.value
                : null,
            valueDate:
              statisticDataUpdateDto.valueDate !== undefined
                ? statisticDataUpdateDto.valueDate
                : null,
            isCorrelation:
              statisticDataUpdateDto.isCorrelation !== undefined
                ? statisticDataUpdateDto.isCorrelation
                : null,
            updatedAt: new Date(),
            statisticId: statistic.id,
            accountId: user.account.id,
          };
          statisticDataUpdateEventDtos.push(statisticDataUpdateEventDto);
          return updatedStatisticDataId;
        },
      );
      await Promise.all(updateStatisticDataPromises);
    }

    if (statisticUpdateDto.statisticDataCreateDtos !== undefined) {
      const createStatisticDataPromises = statisticUpdateDto.statisticDataCreateDtos.map(
        async (statisticDataCreateDto) => {
          statisticDataCreateDto.statistic = statistic;
          const createdStatisticDataId = await this.statisticDataService.create(statisticDataCreateDto);
          const statisticDataCreateEventDto: StatisticDataCreateEventDto = {
            id: createdStatisticDataId,
            value: statisticDataCreateDto.value,
            valueDate: statisticDataCreateDto.valueDate,
            isCorrelation: statisticDataCreateDto.isCorrelation,
            createdAt: new Date(),
            statisticId: statistic.id,
            accountId: user.account.id,
          };
          statisticDataCreateEventDtos.push(statisticDataCreateEventDto);
          return createdStatisticDataId;
        },
      );
      await Promise.all(createStatisticDataPromises);
    }

    const statisticUpdateEventDto: StatisticUpdateEventDto = {
      eventType: 'STATISTIC_UPDATED',
      id: statistic.id,
      type:
        statisticUpdateDto.type !== undefined
          ? (statisticUpdateDto.type as string)
          : null,
      name:
        statisticUpdateDto.name !== undefined ? statisticUpdateDto.name : null,
      description:
        statisticUpdateDto.description !== undefined
          ? statisticUpdateDto.description
          : null,
      updatedAt: new Date(),
      postId:
        statisticUpdateDto.postId !== undefined
          ? statisticUpdateDto.postId
          : null,
      statisticDataUpdateDtos:
        statisticDataUpdateEventDtos.length > 0
          ? statisticDataUpdateEventDtos
          : null,
      statisticDataCreateDtos:
        statisticDataCreateEventDtos.length > 0
          ? statisticDataCreateEventDtos
          : null,
      accountId: user.account.id,
    };
    try {
      await Promise.race([
        this.producerService.sendUpdatedStatisticToQueue(
          statisticUpdateEventDto,
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
      `${yellow('OK!')} - UPDATED STATISTIC: ${JSON.stringify(statisticUpdateDto)} - Статистика успешно обновлена!`,
    );
    return { id: updatedStatisticId };
  }

  @Patch(':postId/updateBulk')
  @ApiOperation({ summary: 'Обновить статистикам postId' })
  @ApiBody({
    description: 'ДТО для обновления статистики',
    type: StatisticUpdateBulkDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: 'Статистики успешно обновлены.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресурс не найден!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'Id поста',
    example: '2420fabb-3e37-445f-87e6-652bfd5a050c',
  })
  async updateBulk(
    @Param('postId') postId: string,
    @Body() statisticUpdateBulkDto: StatisticUpdateBulkDto,
  ): Promise<{ message: string }> {
    const post = await this.postService.findOneById(postId)
    const updateStatisticPromises = statisticUpdateBulkDto.ids.map(
      async (id) => {
        const statisticUpdateDto: StatisticUpdateDto = {
          _id: id,
          postId: postId,
          post: post
        };
        const updatedStatisticId = await this.statisticService.update(statisticUpdateDto._id, statisticUpdateDto);

        return updatedStatisticId;
      },
    );
    await Promise.all(updateStatisticPromises);
    return { message: 'Статистики успешно обновлены.' };
  }


  @Post('new')
  @ApiOperation({ summary: 'Создать статистику' })
  @ApiBody({
    description: 'ДТО для создания статистики',
    type: StatisticCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: { "id": "f35dc993-1c7e-4f55-9ddd-45d8841d4396" },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async create(
    @Req() req: ExpressRequest,
    @Body() statisticCreateDto: StatisticCreateDto,
  ): Promise<{ id: string }> {
    const statisticDataCreateEventDtos: StatisticDataCreateEventDto[] = [];
    const user = req.user as ReadUserDto;
    const post = await this.postService.findOneById(statisticCreateDto.postId);

    statisticCreateDto.account = user.account;
    statisticCreateDto.post = post;

    const createdStatistic = await this.statisticService.create(statisticCreateDto);

    if (statisticCreateDto.statisticDataCreateDtos !== undefined) {
      const statisticDataCreatePromises =
        statisticCreateDto.statisticDataCreateDtos.map(
          async (statisticDataCreateDto) => {
            statisticDataCreateDto.statistic = createdStatistic;
            const createdStatisticDataId =
              await this.statisticDataService.create(statisticDataCreateDto);
            const statisticDataCreateEventDto: StatisticDataCreateEventDto = {
              id: createdStatisticDataId,
              value: statisticDataCreateDto.value,
              valueDate: statisticDataCreateDto.valueDate,
              isCorrelation: statisticDataCreateDto.isCorrelation,
              createdAt: new Date(),
              statisticId: createdStatistic.id,
              accountId: user.account.id,
            };
            statisticDataCreateEventDtos.push(statisticDataCreateEventDto);
            return createdStatisticDataId;
          },
        );

      await Promise.all(statisticDataCreatePromises);
    }

    const statisticCreateEventDto: StatisticCreateEventDto = {
      eventType: 'STATISTIC_CREATED',
      id: createdStatistic.id,
      type:
        statisticCreateDto.type !== undefined
          ? (statisticCreateDto.type as string)
          : (Type.DIRECT as string),
      name: statisticCreateDto.name,
      description:
        statisticCreateDto.description !== undefined
          ? statisticCreateDto.description
          : null,
      createdAt: new Date(),
      postId: statisticCreateDto.postId,
      accountId: user.account.id,
      statisticDataCreateDtos:
        statisticDataCreateEventDtos.length > 0
          ? statisticDataCreateEventDtos
          : null,
    };

    try {
      await Promise.race([
        this.producerService.sendCreatedStatisticToQueue(
          statisticCreateEventDto,
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
      `${yellow('OK!')} - statisticCreateDto: ${JSON.stringify(statisticCreateDto)} - Создана новая статистика!`,
    );
    return { id: createdStatistic.id };
  }

  @Get(':statisticId/statistic')
  @ApiOperation({ summary: 'Получить статистику по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "id": "625b007f-2215-48b8-94aa-194e74d94eb4",
      "type": "Прямая",
      "name": "Статистика",
      "description": "fdgdfgdf",
      "createdAt": "2024-12-05T20:45:13.931Z",
      "updatedAt": "2024-12-17T14:42:01.999Z",
      "statisticDatas": [
        {
          "id": "edbc1605-e809-45ec-b3dc-7edaba26e789",
          "value": 200,
          "valueDate": "2024-12-13T00:00:00.000Z",
          "isCorrelation": false,
          "createdAt": "2024-12-05T20:45:14.070Z",
          "updatedAt": "2024-12-05T20:45:14.070Z"
        },
      ],
      "post": {
        "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
        "postName": "Post",
        "divisionName": "Подразделение №69",
        "divisionNumber": 69,
        "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
        "product": "fasf",
        "purpose": "sfsf",
        "createdAt": "2024-12-05T20:28:06.763Z",
        "updatedAt": "2024-12-05T20:28:06.763Z"
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Статистика не найдена!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  @ApiParam({
    name: 'statisticId',
    required: true,
    description: 'Id статистики',
  })
  async findOne(
    @Param('statisticId') statisticId: string,
  ): Promise<StatisticReadDto> {
    var start = new Date().getTime();

    const statistic = await this.statisticService.findOneById(statisticId, [
      'statisticDatas',
      'post',
    ]);
    var end = new Date().getTime();

    var time = end - start;

    console.log('Время выполнения = ' + time);
    return statistic;
  }
}
