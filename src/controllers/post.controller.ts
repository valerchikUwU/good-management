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
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { PostService } from 'src/application/services/post/post.service';
import { UsersService } from 'src/application/services/users/users.service';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';
import { PostCreateDto } from 'src/contracts/post/create-post.dto';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PostUpdateDto } from 'src/contracts/post/update-post.dto';
import { OrganizationReadDto } from 'src/contracts/organization/read-organization.dto';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { PostCreateEventDto } from 'src/contracts/post/createEvent-post.dto';
import { PostUpdateEventDto } from 'src/contracts/post/updateEvent-post.dto';
import { TimeoutError } from 'rxjs';
import { GroupService } from 'src/application/services/group/group.service';
import { GroupUpdateDto } from 'src/contracts/group/update-group.dto';
import { HistoryUsersToPostService } from 'src/application/services/historyUsersToPost/historyUsersToPost.service';
import { HistoryUsersToPostCreateDto } from 'src/contracts/historyUsersToPost/create-historyUsersToPost.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request as ExpressRequest } from 'express';

@ApiTags('Posts')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UsersService,
    private readonly policyService: PolicyService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
    private readonly groupService: GroupService,
    private readonly historyUsersToPostService: HistoryUsersToPostService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get(':organizationId')
  @ApiOperation({ summary: 'Все посты в организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
        "postName": "Post",
        "divisionName": "Подразделение №69",
        "divisionNumber": 69,
        "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
        "product": "fasf",
        "purpose": "sfsf",
        "createdAt": "2024-12-05T20:28:06.763Z",
        "updatedAt": "2024-12-05T20:28:06.763Z",
        "user": {
          "id": "bc807845-08a8-423e-9976-4f60df183ae2",
          "firstName": "Максим",
          "lastName": "Ковальская",
          "middleName": "Тимофеевич",
          "telegramId": 453120600,
          "telephoneNumber": "+79787513901",
          "avatar_url": null,
          "vk_id": null,
          "createdAt": "2024-12-04T13:16:56.785Z",
          "updatedAt": "2024-12-04T15:37:36.501Z"
        }
      },
      {
        "id": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
        "postName": "чясми",
        "divisionName": "Подразделение №66",
        "divisionNumber": 66,
        "parentId": null,
        "product": "ясчм",
        "purpose": "яывсачм",
        "createdAt": "2024-12-04T15:50:26.335Z",
        "updatedAt": "2024-12-06T13:34:56.291Z",
        "user": null
      }
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
  async findAll(
    @Param('organizationId') organizationId: string
  ): Promise<PostReadDto[]> {
    const posts = await this.postService.findAllForOrganization(organizationId, [
      'user',
    ]);
    return posts;
  }

  @Patch(':postId/update')
  @ApiOperation({ summary: 'Обновить пост по Id' })
  @ApiBody({
    description: 'ДТО для обновления поста',
    type: PostUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '7730b6c2-c037-4c45-9dcc-603d7035d6a3',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Пост не найден!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ name: 'postId', required: true, description: 'Id поста' })
  async update(
    @Req() req: ExpressRequest,
    @Param('postId') postId: string,
    @Body() postUpdateDto: PostUpdateDto,
  ): Promise<{ id: string }> {
    console.log('asdasdasdasd')
    const user = req.user as ReadUserDto;

    const promises: Promise<void>[] = [];

    // Условно добавляем запросы в массив промисов
    if (postUpdateDto.policyId !== null) {
      promises.push(
        this.policyService.findOneById(postUpdateDto.policyId).then(policy => {
          postUpdateDto.policy = policy;
        }),
      );
    }

    if (postUpdateDto.responsibleUserId !== null) {
      promises.push(
        this.userService.findOne(postUpdateDto.responsibleUserId).then(user => {
          postUpdateDto.user = user;
        }),
      );
    }


    // Выполняем все запросы параллельно
    await Promise.all(promises);

    const updatedPostId = await this.postService.update(postId, postUpdateDto);
    if (postUpdateDto.responsibleUserId) {
      const updatedPost = await this.postService.findOneById(updatedPostId);
      const historyUsersToPostCreateDto: HistoryUsersToPostCreateDto = {
        user: postUpdateDto.user,
        post: updatedPost
      }
      this.historyUsersToPostService.create(historyUsersToPostCreateDto)
        .catch((error) => {
          this.logger.error(
            `Failed to create historyUsersToPost: ${error.message}`,
          );
        });;
    }
    const updatedEventPostDto: PostUpdateEventDto = {
      eventType: 'POST_UPDATED',
      id: updatedPostId,
      postName:
        postUpdateDto.postName !== undefined ? postUpdateDto.postName : null,
      divisionName:
        postUpdateDto.divisionName !== undefined
          ? postUpdateDto.divisionName
          : null,
      parentId:
        postUpdateDto.parentId !== undefined ? postUpdateDto.parentId : null,
      product:
        postUpdateDto.product !== undefined ? postUpdateDto.product : null,
      purpose:
        postUpdateDto.purpose !== undefined ? postUpdateDto.purpose : null,
      updatedAt: new Date(),
      policyId:
        postUpdateDto.policyId !== undefined ? postUpdateDto.policyId : null,
      responsibleUserId:
        postUpdateDto.responsibleUserId !== undefined
          ? postUpdateDto.responsibleUserId
          : null,
      accountId: user.account.id,
    };
    try {
      await Promise.race([
        this.producerService.sendUpdatedPostToQueue(updatedEventPostDto),
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
      `${yellow('OK!')} - UPDATED POST: ${JSON.stringify(postUpdateDto)} - Пост успешно обновлен!`,
    );
    return { id: updatedPostId };
  }

  @Get(':organizationId/new')
  @ApiOperation({ summary: 'Получить данные для создания поста' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "workers": [
        {
          "id": "bc807845-08a8-423e-9976-4f60df183ae2",
          "firstName": "Максим",
          "lastName": "Ковальская",
          "middleName": "Тимофеевич",
          "telegramId": 453120600,
          "telephoneNumber": "+79787513901",
          "avatar_url": null,
          "vk_id": null,
          "createdAt": "2024-12-04T13:16:56.785Z",
          "updatedAt": "2024-12-04T15:37:36.501Z"
        }
      ],
      "policies": [
        {
          "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
          "policyName": "Привет",
          "policyNumber": 152,
          "state": "Активный",
          "type": "Директива",
          "dateActive": "2024-12-20T11:14:27.156Z",
          "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
          "createdAt": "2024-12-12T13:30:48.085Z",
          "updatedAt": "2024-12-20T11:14:27.436Z"
        }
      ],
      "posts": [
        {
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
      ],
      "maxDivisionNumber": 71
    }
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
  async beforeCreate(
    @Param('organizationId') organizationId: string
  ): Promise<{
    workers: ReadUserDto[];
    policies: PolicyReadDto[];
    posts: PostReadDto[];
    maxDivisionNumber: number;
  }> {
    const [policies, workers, posts, maxDivisionNumber] = await Promise.all([
      await this.policyService.findAllActiveForOrganization(organizationId),
      await this.userService.findAllForOrganization(organizationId),
      await this.postService.findAllForOrganization(organizationId),
      await this.postService.findMaxDivisionNumber()
    ])

    return {
      workers: workers,
      policies: policies,
      posts: posts,
      maxDivisionNumber: maxDivisionNumber
    };
  }

  @Get(':postId/post')
  @ApiOperation({ summary: 'Получить пост по id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "currentPost": {
        "id": "993b64bc-1703-415a-89a9-6e191b3d46bb",
        "postName": "asdsads",
        "divisionName": "Подразделение №65",
        "divisionNumber": 65,
        "parentId": null,
        "product": "asd",
        "purpose": "sadsad",
        "createdAt": "2024-12-04T15:12:11.525Z",
        "updatedAt": "2024-12-05T19:54:57.861Z",
        "user": {
          "id": "39142b0d-3166-4cd7-b663-270ff064479c",
          "firstName": "Дмитрий",
          "lastName": "Климов",
          "middleName": null,
          "telegramId": 1587439475,
          "telephoneNumber": "+79852300581",
          "avatar_url": null,
          "vk_id": null,
          "createdAt": "2024-12-04T14:48:20.726Z",
          "updatedAt": "2024-12-06T10:02:45.285Z"
        },
        "policy": {
          "id": "bae516be-92fe-4f6d-83a0-fefdbffc2924",
          "policyName": "Для Максика",
          "policyNumber": 140,
          "state": "Активный",
          "type": "Директива",
          "dateActive": "2024-12-04T13:29:07.047Z",
          "content": "content",
          "createdAt": "2024-12-04T14:07:05.408Z",
          "updatedAt": "2024-12-16T11:16:38.554Z"
        },
        "statistics": [
          {
            "id": "1aa4399e-671c-44ee-bad3-2f01554c7f0a",
            "type": "Прямая",
            "name": "Статистика2",
            "description": "gg",
            "createdAt": "2024-12-05T20:47:26.358Z",
            "updatedAt": "2024-12-17T15:48:12.579Z"
          },
          {
            "id": "8dace696-59a8-451e-91df-31b18e267337",
            "type": "Обратная",
            "name": "Статистика3",
            "description": null,
            "createdAt": "2024-12-06T08:52:05.820Z",
            "updatedAt": "2024-12-17T15:48:12.586Z"
          }
        ],
        "organization": {
          "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
          "organizationName": "Калоеды",
          "parentOrganizationId": null,
          "reportDay": 2,
          "createdAt": "2024-12-04T13:14:47.767Z",
          "updatedAt": "2024-12-06T07:09:10.117Z"
        },
        "isHasChildPost": false
      },
      "posts": [
        {
          "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "postName": "Post",
          "divisionName": "Подразделение №69",
          "divisionNumber": 69,
          "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
          "product": "fasf",
          "purpose": "sfsf",
          "createdAt": "2024-12-05T20:28:06.763Z",
          "updatedAt": "2024-12-05T20:28:06.763Z",
          "user": {
            "id": "bc807845-08a8-423e-9976-4f60df183ae2",
            "firstName": "Максим",
            "lastName": "Ковальская",
            "middleName": "Тимофеевич",
            "telegramId": 453120600,
            "telephoneNumber": "+79787513901",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-04T13:16:56.785Z",
            "updatedAt": "2024-12-04T15:37:36.501Z"
          }
        }
      ],
      "workers": [
        {
          "id": "bc807845-08a8-423e-9976-4f60df183ae2",
          "firstName": "Максим",
          "lastName": "Ковальская",
          "middleName": "Тимофеевич",
          "telegramId": 453120600,
          "telephoneNumber": "+79787513901",
          "avatar_url": null,
          "vk_id": null,
          "createdAt": "2024-12-04T13:16:56.785Z",
          "updatedAt": "2024-12-04T15:37:36.501Z"
        }
      ],
      "policiesActive": [
        {
          "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
          "policyName": "Привет",
          "policyNumber": 152,
          "state": "Активный",
          "type": "Директива",
          "dateActive": "2024-12-20T11:14:27.156Z",
          "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
          "createdAt": "2024-12-12T13:30:48.085Z",
          "updatedAt": "2024-12-20T11:14:27.436Z"
        }
      ]
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пост не найден!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async findOne(
    @Param('postId') postId: string,
  ): Promise<{
    currentPost: PostReadDto;
    posts: PostReadDto[];
    parentPost: PostReadDto;
    workers: ReadUserDto[];
    policiesActive: PolicyReadDto[];
  }> {
    
    const currentPost = await this.postService.findOneById(postId, ['policy', 'user', 'organization', 'statistics']);
    const [posts, workers, policiesActive] = await Promise.all([
      await this.postService.findAllForOrganization(currentPost.organization.id, ['user']),
      await this.userService.findAllForOrganization(currentPost.organization.id),
      await this.policyService.findAllActiveForOrganization(currentPost.organization.id),
    ])
    const _posts = posts.filter((post) => post.id !== currentPost.id)
    const parentPost = posts.find((post) => post.id === currentPost.parentId);
    const isHasChildPost = posts.some((post) => post.parentId === currentPost.id);
    const _currentPost = { ...currentPost, isHasChildPost };
    return {
      currentPost: _currentPost,
      posts: _posts,
      parentPost: parentPost,
      workers: workers,
      policiesActive: policiesActive
    };
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать пост' })
  @ApiBody({
    description: 'ДТО для создания поста',
    type: PostCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: '2420fabb-3e37-445f-87e6-652bfd5a050c',
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
  @ApiQuery({
    name: 'addPolicyId',
    required: false,
    description: 'Id политики',
    example: 'null',
  })
  async create(
    @Req() req: ExpressRequest,
    @Body() postCreateDto: PostCreateDto,
    @Query('addPolicyId') addPolicyId?: string,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const promises: Promise<void>[] = [];

    // Условно добавляем запросы в массив промисов
    if (addPolicyId !== 'null') {
      promises.push(
        this.policyService.findOneById(addPolicyId).then(policy => {
          postCreateDto.policy = policy;
        }),
      );
    }

    if (postCreateDto.responsibleUserId) {
      promises.push(
        this.userService.findOne(postCreateDto.responsibleUserId).then(user => {
          postCreateDto.user = user;
        }),
      );
    }

    promises.push(
      this.organizationService.findOneById(postCreateDto.organizationId).then(
        organization => {
          postCreateDto.organization = organization;
        },
      ),
    );

    // Выполняем все запросы параллельно
    await Promise.all(promises);

    postCreateDto.account = user.account;
    const createdPostId = await this.postService.create(postCreateDto);
    if (postCreateDto.responsibleUserId) {
      const createdPost = await this.postService.findOneById(createdPostId);
      const historyUsersToPostCreateDto: HistoryUsersToPostCreateDto = {
        user: postCreateDto.user,
        post: createdPost
      }
      this.historyUsersToPostService.create(historyUsersToPostCreateDto)
        .catch((error) => {
          this.logger.error(
            `Failed to create historyUsersToPost: ${error.message}`,
          );
        });;
    }



    // if (postCreateDto.divisionName && postCreateDto.responsibleUserId) {
    //   const groups = await this.groupService.findAllByDivisionName(postCreateDto.divisionName); ЕСЛИ В ОТДЕЛЕ ОТДЕЛ, ТО КАК ЕГО ОБНОВЛЯТЬ
    //   const groupToUsersId = groups.flatMap(group =>
    //     group.groupToUsers.map(groupToUser => groupToUser.user.id)
    //   );
    //   groupToUsersId.push(postCreateDto.responsibleUserId);
    //   const groupUpdateDto: GroupUpdateDto = {
    //     groupToUsers: groupToUsersId
    //   }

    // }
    const createdEventPostDto: PostCreateEventDto = {
      eventType: 'POST_CREATED',
      id: createdPostId,
      postName: postCreateDto.postName,
      divisionName:
        postCreateDto.divisionName !== undefined
          ? postCreateDto.divisionName
          : null,
      parentId:
        postCreateDto.parentId !== undefined ? postCreateDto.parentId : null,
      product: postCreateDto.product,
      purpose: postCreateDto.purpose,
      createdAt: new Date(),
      policyId: addPolicyId !== 'null' ? addPolicyId : null,
      accountId: user.account.id,
      responsibleUserId:
        postCreateDto.responsibleUserId !== undefined
          ? postCreateDto.responsibleUserId
          : null,
      organizationId:
        postCreateDto.organizationId !== undefined
          ? postCreateDto.organizationId
          : null,
    };
    try {
      await Promise.race([
        this.producerService.sendCreatedPostToQueue(createdEventPostDto),
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
      `${yellow('OK!')} - postCreateDto: ${JSON.stringify(postCreateDto)} - Создан новый пост!`,
    );
    return { id: createdPostId };
  }
}
