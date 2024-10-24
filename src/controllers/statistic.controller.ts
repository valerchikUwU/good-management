import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/application/services/users/users.service";
import { StatisticService } from "src/application/services/statistic/statistic.service";
import { StatisticReadDto } from "src/contracts/statistic/read-statistic.dto";
import { StatisticCreateDto } from "src/contracts/statistic/create-statistic.dto";
import { Statistic } from "src/domains/statistic.entity";
import { StatisticDataCreateDto } from "src/contracts/statisticData/create-statisticData.dto";
import { StatisticDataService } from "src/application/services/statisticData/statisticData.service";
import { PostService } from "src/application/services/post/post.service";
import { PostReadDto } from "src/contracts/post/read-post.dto";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { StatisticDataReadDto } from "src/contracts/statisticData/read-statisticData.dto";
import { StatisticUpdateDto } from "src/contracts/statistic/update-statistic.dto";

@ApiTags('Statistic')
@Controller(':userId/statistics')
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService,
    private readonly userService: UsersService,
    private readonly statisticDataService: StatisticDataService,
    private readonly postService: PostService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Все статистики' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: [
      {
        id: "f35dc993-1c7e-4f55-9ddd-45d8841d4396",
        type: "Прямая",
        name: "Название",
        description: "Описание",
        createdAt: "2024-09-26T12:28:01.476Z",
        updatedAt: "2024-09-26T12:28:01.476Z",
        statisticDatas: [],
        post: {
          id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
          postName: "Директор",
          divisionName: "Отдел продаж",
          parentId: null,
          product: "Продукт",
          purpose: "Предназначение поста",
          createdAt: "2024-09-20T15:09:14.997Z",
          updatedAt: "2024-09-20T15:09:14.997Z"
        }
      }
    ]
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async findAll(@Param('userId') userId: string): Promise<StatisticReadDto[]> {
    const user = await this.userService.findOne(userId);
    return await this.statisticService.findAllForAccount(user.account)
  }


  @Patch(':statisticId/update')
  @ApiOperation({ summary: 'Обновить статистику' })
  @ApiBody({
    description: 'ДТО для обновления статистики',
    type: StatisticUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "ed2dfe55-b678-4f7e-a82e-ccf395afae05",
      type: "Прямая",
      name: "ВНИМАНИЕ анекдот",
      description: "Описание",
      createdAt: "2024-10-17T09:27:25.379Z",
      updatedAt: "2024-10-17T10:21:49.335Z"
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Ресурс не найден!" })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'statisticId', required: true, description: 'Id статистики' })
  async update(@Param('statisticId') statisticId: string, @Param('userId') userId: string, @Body() statisticUpdateDto: StatisticUpdateDto, @Ip() ip: string): Promise<StatisticReadDto> {
    const post = statisticUpdateDto.postId !== undefined ? await this.postService.findOneById(statisticUpdateDto.postId) : null
    if (post !== null) {
      statisticUpdateDto.post = post;
    }
    const updatedStatistic = await this.statisticService.update(statisticId, statisticUpdateDto);
    if (statisticUpdateDto.statisticDataUpdateDtos !== undefined) {
      const updateStatisticDataPromises = statisticUpdateDto.statisticDataUpdateDtos.map(async (statisticDataUpdateDto) => {
        return this.statisticDataService.update(statisticDataUpdateDto);
      });
      await Promise.all(updateStatisticDataPromises); // Ждём выполнения всех операций update
    }

    if (statisticUpdateDto.statisticDataCreateDtos !== undefined) {
      const createStatisticDataPromises = statisticUpdateDto.statisticDataCreateDtos.map(async (statisticDataCreateDto) => {
        statisticDataCreateDto.statistic = updatedStatistic;
        return this.statisticDataService.create(statisticDataCreateDto); // Возвращаем промис создания
      });
      await Promise.all(createStatisticDataPromises); // Ждём выполнения всех операций create
    }


    this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED STATISTIC: ${JSON.stringify(statisticUpdateDto)} - Статистика успешно обновлена!`);
    return updatedStatistic;
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания новой статистики' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: [
      {
        id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
        postName: "Директор",
        divisionName: "Отдел продаж",
        parentId: null,
        product: "Продукт",
        purpose: "Предназначение поста",
        createdAt: "2024-09-20T15:09:14.997Z",
        updatedAt: "2024-09-20T15:09:14.997Z",
        user: {
          id: "3b809c42-2824-46c1-9686-dd666403402a",
          firstName: "Maxik",
          lastName: "Koval",
          telegramId: 453120600,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: "2024-09-16T14:03:31.000Z",
          updatedAt: "2024-09-16T14:03:31.000Z"
        },
        organization: {
          id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
          organizationName: "soplya firma",
          parentOrganizationId: null,
          createdAt: "2024-09-16T14:24:33.841Z",
          updatedAt: "2024-09-16T14:24:33.841Z"
        }
      }
    ]
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<PostReadDto[]> {
    const user = await this.userService.findOne(userId)
    const posts = await this.postService.findAllForAccount(user.account)
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
    status: HttpStatus.OK, description: "ОК!",
    example: {
      type: "Прямая",
      name: "Название",
      description: "Описание",
      account: {
        id: "a1118813-8985-465b-848e-9a78b1627f11",
        accountName: "OOO PIPKA",
        createdAt: "2024-09-16T12:53:29.593Z",
        updatedAt: "2024-09-16T12:53:29.593Z"
      },
      post: {
        id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
        postName: "Директор",
        divisionName: "Отдел продаж",
        parentId: null,
        product: "Продукт",
        purpose: "Предназначение поста",
        createdAt: "2024-09-20T15:09:14.997Z",
        updatedAt: "2024-09-20T15:09:14.997Z"
      },
      id: "f35dc993-1c7e-4f55-9ddd-45d8841d4396",
      createdAt: "2024-09-26T12:28:01.476Z",
      updatedAt: "2024-09-26T12:28:01.476Z"
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Body() statisticCreateDto: StatisticCreateDto): Promise<{ statistic: Statistic, values: StatisticDataReadDto[] }> {
    const [user, post] = await Promise.all([
      this.userService.findOne(userId),
      this.postService.findOneById(statisticCreateDto.postId)
    ]);
  
    statisticCreateDto.account = user.account;
    statisticCreateDto.post = post;

    const createdStatistic = await this.statisticService.create(statisticCreateDto);

    // Используем map для создания массива промисов
    const statisticDataCreatePromises = statisticCreateDto.statisticDataCreateDtos.map(async (statisticDataCreateDto) => {
      statisticDataCreateDto.statistic = createdStatistic;
      return this.statisticDataService.create(statisticDataCreateDto); // Возвращаем промис создания
    });

    // Ожидаем выполнения всех промисов параллельно и сохраняем результаты
    const statisticDataReadDtos = await Promise.all(statisticDataCreatePromises);

    // Возвращаем результат
    return { statistic: createdStatistic, values: statisticDataReadDtos };

  }


  @Get(':statisticId')
  @ApiOperation({ summary: 'Получить статистику по ID' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      currentStatistic: {
        id: "84e424e5-f1fa-47f6-888a-75ecf7625ced",
        type: "Прямая",
        name: "Название 9",
        description: "Описание",
        createdAt: "2024-09-26T13:03:19.759Z",
        updatedAt: "2024-09-26T13:03:19.759Z",
        statisticDatas: [
          {
            id: "946da215-34c4-495b-b648-6063877c8590",
            createdAt: "2024-09-26T13:03:19.898Z",
            updatedAt: "2024-09-26T13:03:19.898Z",
            value: 44500
          },
          {
            id: "93a03130-9692-4934-bbfc-0ae29d69cf3b",
            createdAt: "2024-09-26T13:03:20.023Z",
            updatedAt: "2024-09-26T13:03:20.023Z",
            value: 54000
          }
        ]
      },
      posts: [
        {
          id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
          postName: "Директор",
          divisionName: "Отдел продаж",
          parentId: null,
          product: "Продукт",
          purpose: "Предназначение поста",
          createdAt: "2024-09-20T15:09:14.997Z",
          updatedAt: "2024-09-20T15:09:14.997Z",
          user: {
            id: "3b809c42-2824-46c1-9686-dd666403402a",
            firstName: "Maxik",
            lastName: "Koval",
            telegramId: 453120600,
            telephoneNumber: null,
            avatar_url: null,
            vk_id: null,
            createdAt: "2024-09-16T14:03:31.000Z",
            updatedAt: "2024-09-16T14:03:31.000Z"
          },
          organization: {
            id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
            organizationName: "soplya firma",
            parentOrganizationId: null,
            createdAt: "2024-09-16T14:24:33.841Z",
            updatedAt: "2024-09-16T14:24:33.841Z"
          }
        }
      ]
    }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Статистика не найдена!` })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiParam({ name: 'statisticId', required: true, description: 'Id статистики' })
  async findOne(@Param('statisticId') statisticId: string, @Ip() ip: string): Promise<StatisticReadDto> {
    const statistic = await this.statisticService.findOneById(statisticId);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT STATISTIC: ${JSON.stringify(statistic)} - Получить статистику по ID!`);
    return statistic;
  }

}