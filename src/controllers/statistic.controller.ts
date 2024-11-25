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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from 'src/application/services/users/users.service';
import { StatisticService } from 'src/application/services/statistic/statistic.service';
import { StatisticReadDto } from 'src/contracts/statistic/read-statistic.dto';
import { StatisticCreateDto } from 'src/contracts/statistic/create-statistic.dto';
import { Statistic, Type } from 'src/domains/statistic.entity';
import { StatisticDataService } from 'src/application/services/statisticData/statisticData.service';
import { PostService } from 'src/application/services/post/post.service';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
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

@ApiTags('Statistic')
@Controller(':userId/statistics')
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService,
    private readonly userService: UsersService,
    private readonly statisticDataService: StatisticDataService,
    private readonly postService: PostService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Все статистики' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: 'f35dc993-1c7e-4f55-9ddd-45d8841d4396',
        type: 'Прямая',
        name: 'Название',
        description: 'Описание',
        createdAt: '2024-09-26T12:28:01.476Z',
        updatedAt: '2024-09-26T12:28:01.476Z',
        statisticDatas: [],
        post: {
          id: '2420fabb-3e37-445f-87e6-652bfd5a050c',
          postName: 'Директор',
          divisionName: 'Отдел продаж',
          parentId: null,
          product: 'Продукт',
          purpose: 'Предназначение поста',
          createdAt: '2024-09-20T15:09:14.997Z',
          updatedAt: '2024-09-20T15:09:14.997Z',
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
  @ApiQuery({
    name: 'statisticData',
    required: true,
    description: 'Флаг для отправки доп данных',
    example: true,
  })
  async findAll(@Param('userId') userId: string, @Query('statisticData') statisticData: boolean): Promise<StatisticReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    let relations: string[]
    if(statisticData){
      relations = ['statisticDatas', 'post.organization']
    }
    return await this.statisticService.findAllForAccount(user.account, relations);
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
    example: 'ed2dfe55-b678-4f7e-a82e-ccf395afae05',
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
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({
    name: 'statisticId',
    required: true,
    description: 'Id статистики',
  })
  async update(
    @Param('statisticId') statisticId: string,
    @Param('userId') userId: string,
    @Body() statisticUpdateDto: StatisticUpdateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId, ['account']);
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
      `${yellow('OK!')} - ${red(ip)} - UPDATED STATISTIC: ${JSON.stringify(statisticUpdateDto)} - Статистика успешно обновлена!`,
    );
    return { id: updatedStatisticId };
  }

  // @Patch(':postId/updateBulk')
  // @ApiOperation({ summary: 'Обновить статистикам postId' })
  // @ApiBody({
  //   description: 'ДТО для обновления статистики',
  //   type: StatisticUpdateDto,
  //   required: true,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'ОК!',
  //   example: 'ed2dfe55-b678-4f7e-a82e-ccf395afae05',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Ресурс не найден!',
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
  // @ApiParam({
  //   name: 'postId',
  //   required: true,
  //   description: 'Id поста',
  // })
  // async updateBulk(
  //   @Param('userId') userId: string,
  //   @Param('postId') postId: string,
  //   @Body() statisticUpdateBulkDto: StatisticUpdateBulkDto,
  //   @Ip() ip: string,
  // ): Promise<void> {
  //   return await 
  // }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания новой статистики' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '2420fabb-3e37-445f-87e6-652bfd5a050c',
        postName: 'Директор',
        divisionName: 'Отдел продаж',
        parentId: null,
        product: 'Продукт',
        purpose: 'Предназначение поста',
        createdAt: '2024-09-20T15:09:14.997Z',
        updatedAt: '2024-09-20T15:09:14.997Z',
        user: {
          id: '3b809c42-2824-46c1-9686-dd666403402a',
          firstName: 'Maxik',
          lastName: 'Koval',
          telegramId: 453120600,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: '2024-09-16T14:03:31.000Z',
          updatedAt: '2024-09-16T14:03:31.000Z',
        },
        organization: {
          id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          organizationName: 'soplya firma',
          parentOrganizationId: null,
          createdAt: '2024-09-16T14:24:33.841Z',
          updatedAt: '2024-09-16T14:24:33.841Z',
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
  async beforeCreate(
    @Param('userId') userId: string,
    @Ip() ip: string,
  ): Promise<PostReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    const posts = await this.postService.findAllForAccount(user.account, [
      'user',
      'organization',
    ]);
    return posts;
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
    example: 'f35dc993-1c7e-4f55-9ddd-45d8841d4396',
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
  async create(
    @Param('userId') userId: string,
    @Body() statisticCreateDto: StatisticCreateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const statisticDataCreateEventDtos: StatisticDataCreateEventDto[] = [];
    const [user, post] = await Promise.all([
      this.userService.findOne(userId, ['account']),
      this.postService.findOneById(statisticCreateDto.postId),
    ]);

    statisticCreateDto.account = user.account;
    statisticCreateDto.post = post;

    const createdStatistic =
      await this.statisticService.create(statisticCreateDto);

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
      `${yellow('OK!')} - ${red(ip)} - statisticCreateDto: ${JSON.stringify(statisticCreateDto)} - Создана новая статистика!`,
    );
    return { id: createdStatistic.id };
  }

  @Get(':statisticId')
  @ApiOperation({ summary: 'Получить статистику по ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: 'e954602d-9513-4998-bf3d-779b13a44cd8',
      type: 'Прямая',
      name: 'Название 7',
      description: 'Описание',
      createdAt: '2024-09-26T12:56:30.851Z',
      updatedAt: '2024-09-26T12:56:30.851Z',
      statisticDatas: [
        {
          id: 'ea993b7d-f98f-4c03-8f7a-d5894252782f',
          createdAt: '2024-09-26T12:56:31.009Z',
          updatedAt: '2024-09-26T12:56:31.009Z',
          value: 44500,
          valueDate: '2024-10-16T09:44:40.843Z',
        },
        {
          id: '93a3c15a-1381-4a64-8ab1-8ad3679f8a02',
          createdAt: '2024-09-26T12:56:31.156Z',
          updatedAt: '2024-09-26T12:56:31.156Z',
          value: 54000,
          valueDate: '2024-10-16T09:44:40.843Z',
        },
      ],
      post: {
        id: '2420fabb-3e37-445f-87e6-652bfd5a050c',
        postName: 'Чурка',
        divisionName: 'Отдел дубней',
        parentId: '87af2eb9-a17d-4e78-b847-9d512cb9a0c9',
        product: 'Продукт1234',
        purpose: 'asdasd',
        createdAt: '2024-09-20T15:09:14.997Z',
        updatedAt: '2024-10-04T14:57:24.294Z',
        organization: {
          id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
          organizationName: 'soplya firma',
          parentOrganizationId: null,
          reportDay: 5,
          createdAt: '2024-09-16T14:24:33.841Z',
          updatedAt: '2024-09-16T14:24:33.841Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Статистика не найдена!`,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({
    name: 'statisticId',
    required: true,
    description: 'Id статистики',
  })
  async findOne(
    @Param('statisticId') statisticId: string,
    @Ip() ip: string,
  ): Promise<StatisticReadDto> {
    const statistic = await this.statisticService.findOneById(statisticId, [
      'statisticDatas',
      'post.organization',
    ]);
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - CURRENT STATISTIC: ${JSON.stringify(statistic)} - Получить статистику по ID!`,
    );
    return statistic;
  }
}
