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

@ApiTags('Posts')
@Controller(':userId/posts')
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

  @Get()
  @ApiOperation({ summary: 'Все посты' })
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
  async findAll(
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Пост не найдена!`,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiParam({ name: 'postId', required: true, description: 'Id поста' })
  async update(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() postUpdateDto: PostUpdateDto,
    @Ip() ip: string,
  ): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId, ['account']);

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

    if (postUpdateDto.organizationId) {
      promises.push(
        this.organizationService.findOneById(postUpdateDto.organizationId).then(
          organization => {
            postUpdateDto.organization = organization;
          },
        ),
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
      organizationId:
        postUpdateDto.organizationId !== undefined
          ? postUpdateDto.organizationId
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
      `${yellow('OK!')} - ${red(ip)} - UPDATED POST: ${JSON.stringify(postUpdateDto)} - Пост успешно обновлен!`,
    );
    return { id: updatedPostId };
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить данные для создания поста' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      workers: [
        {
          id: "a76caf62-bc78-44e9-ba64-6e8e4c5b3248",
          firstName: "Илюха",
          lastName: "Белописькин",
          middleName: null,
          telegramId: 0,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: "2024-10-03T12:53:00.698Z",
          updatedAt: "2024-10-09T09:36:58.656Z"
        },
      ],
      policies: [
        {
          id: "b86e3c85-c2ce-4918-be74-850e5ae3e2c2",
          policyName: "Политика",
          policyNumber: 112,
          state: "Активный",
          type: "Директива",
          dateActive: "2024-11-20T11:35:38.352Z",
          content: "HTML контент (любая строка пройдет)",
          createdAt: "2024-11-20T09:33:48.863Z",
          updatedAt: "2024-11-20T12:34:57.928Z",
          post: null
        }
      ],
      posts: [
        {
          id: "fcf0d021-25f3-47f5-89dd-11d01be2e97d",
          postName: "SDfxcg",
          divisionName: "sdf",
          divisionNumber: 1,
          parentId: null,
          product: "df",
          purpose: "fg",
          createdAt: "2024-10-04T09:40:38.891Z",
          updatedAt: "2024-10-04T09:40:38.891Z"
        }
      ],
      organizations: [
        {
          id: "b1294a99-ec8d-4e62-8345-45da2d89b6b9",
          organizationName: "Светлоярский и Ко",
          parentOrganizationId: null,
          reportDay: 3,
          createdAt: "2024-10-11T13:22:01.835Z",
          updatedAt: "2024-11-14T09:14:12.465Z"
        }
      ],
      maxDivisionNumber: 29
    }
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
  ): Promise<{
    workers: ReadUserDto[];
    policies: PolicyReadDto[];
    posts: PostReadDto[];
    organizations: OrganizationReadDto[];
    maxDivisionNumber: number;
  }> {
    const user = await this.userService.findOne(userId, ['account']);
    const [policies, workers, posts, organizations, maxDivisionNumber] = await Promise.all([
      await this.policyService.findAllActiveForAccount(user.account),
      await this.userService.findAllForAccount(user.account),
      await this.postService.findAllForAccount(user.account, ['organization']),
      await this.organizationService.findAllForAccount(user.account),
      await this.postService.findMaxDivisionNumber()
    ])

    return {
      workers: workers,
      policies: policies,
      posts: posts,
      organizations: organizations,
      maxDivisionNumber: maxDivisionNumber
    };
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Получить пост по id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      currentPost: {
        id: '2420fabb-3e37-445f-87e6-652bfd5a050c',
        postName: 'Директор',
        divisionName: 'Отдел продаж',
        parentId: null,
        product: 'Продукт',
        purpose: 'Предназначение поста',
        createdAt: '2024-09-20T15:09:14.997Z',
        updatedAt: '2024-09-20T15:09:14.997Z',
        user: {
          id: "702dc852-4806-47b7-8b03-1214ef428efd",
          firstName: "Валерий",
          lastName: "Лысенко",
          middleName: null,
          telegramId: 803348257,
          telephoneNumber: "+79787512027",
          avatar_url: null,
          vk_id: null,
          createdAt: "2024-09-30T14:10:48.302Z",
          updatedAt: "2024-10-09T09:27:30.811Z"
        },
        policy: null,
        organization: {
          id: "1f1cca9a-2633-489c-8f16-cddd411ff2d0",
          organizationName: "OOO BOBRIK",
          parentOrganizationId: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
          reportDay: 2,
          createdAt: "2024-09-16T15:09:48.995Z",
          updatedAt: "2024-11-14T12:45:56.249Z"
        }
      },

      posts: [
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
          }
        },
      ],

      parentPost: {
        id: "b576af55-5cda-4656-88ca-a10be96ff36a",
        postName: "Подразделение №37",
        divisionName: "Подразделения",
        divisionNumber: 37,
        parentId: null,
        product: "Подразделение №37",
        purpose: "Подразделение №37",
        createdAt: "2024-11-21T13:53:12.942Z",
        updatedAt: "2024-11-21T13:53:12.942Z",
        user: null
      },
      workers: [
        {
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
      ],
      organizations: [
        {
          id: "b1294a99-ec8d-4e62-8345-45da2d89b6b9",
          organizationName: "Светлоярский и Ко",
          parentOrganizationId: null,
          reportDay: 3,
          createdAt: "2024-10-11T13:22:01.835Z",
          updatedAt: "2024-11-14T09:14:12.465Z"
        },
      ],
      policiesActive: [
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
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Пост не найден!` })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  async findOne(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Ip() ip: string,
  ): Promise<{
    currentPost: PostReadDto;
    posts: PostReadDto[];
    parentPost: PostReadDto;
    workers: ReadUserDto[];
    organizations: OrganizationReadDto[];
    policiesActive: PolicyReadDto[];
  }> {
    const user = await this.userService.findOne(userId, ['account']);
    const currentPost = await this.postService.findOneById(postId, ['policy', 'user', 'organization', 'statistics']);
    const [posts, workers, organizations, policiesActive] = await Promise.all([
      await this.postService.findAllForAccount(user.account, ['user', 'organization']),
      await this.userService.findAllForAccount(user.account),
      await this.organizationService.findAllForAccount(user.account),
      await this.policyService.findAllActiveForAccount(user.account),
    ])
    const _posts = posts.filter((post) => post.id !== currentPost.id)
    const parentPost = posts.find((post) => post.id === currentPost.parentId);
    const isHasChildPost = posts.some((post) => post.parentId === currentPost.id);
    const _currentPost = {...currentPost, isHasChildPost};
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - CURRENT POST: ${JSON.stringify(currentPost)} - Получить пост по ID!`,
    );
    return {
      currentPost: _currentPost,
      posts: _posts,
      parentPost: parentPost,
      workers: workers,
      organizations: organizations,
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: '3b809c42-2824-46c1-9686-dd666403402a',
  })
  @ApiQuery({
    name: 'addPolicyId',
    required: false,
    description: 'Id политики',
    example: 'null',
  })
  async create(
    @Param('userId') userId: string,
    @Body() postCreateDto: PostCreateDto,
    @Ip() ip: string,
    @Query('addPolicyId') addPolicyId?: string,
  ): Promise<{ id: string }> {
    const user = await this.userService.findOne(userId, ['account']);
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

    if (postCreateDto.organizationId) {
      promises.push(
        this.organizationService.findOneById(postCreateDto.organizationId).then(
          organization => {
            postCreateDto.organization = organization;
          },
        ),
      );
    }

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
      `${yellow('OK!')} - ${red(ip)} - postCreateDto: ${JSON.stringify(postCreateDto)} - Создан новый пост!`,
    );
    return { id: createdPostId };
  }
}
