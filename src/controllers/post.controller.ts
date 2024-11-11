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
    @Inject('winston') private readonly logger: Logger,
  ) {}

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
    if (postUpdateDto.responsibleUserId) {
      const responsibleUser = await this.userService.findOne(
        postUpdateDto.responsibleUserId,
      );
      postUpdateDto.user = responsibleUser;
    }
    if (postUpdateDto.organizationId) {
      const organization = await this.organizationService.findOneById(
        postUpdateDto.organizationId,
      );
      postUpdateDto.organization = organization;
    }
    if (postUpdateDto.policyId) {
      const policy = await this.policyService.findOneById(
        postUpdateDto.policyId,
      );
      postUpdateDto.policy = policy;
    }
    const updatedPostId = await this.postService.update(postId, postUpdateDto);
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
      policies: [
        {
          id: 'f6e3ac1f-afd9-42c1-a9f3-d189961c325c',
          policyName: 'Пипка',
          policyNumber: 2,
          state: 'Черновик',
          type: 'Директива',
          dateActive: null,
          content: 'попа',
          createdAt: '2024-09-18T15:06:52.222Z',
          updatedAt: '2024-09-18T15:06:52.222Z',
        },
      ],
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
  async beforeCreate(
    @Param('userId') userId: string,
    @Ip() ip: string,
  ): Promise<{
    workers: ReadUserDto[];
    policies: PolicyReadDto[];
    postsWithoutParentId: PostReadDto[];
    organizations: OrganizationReadDto[];
  }> {
    const user = await this.userService.findOne(userId, ['account']);
    const policies = await this.policyService.findAllActiveWithoutPost(
      user.account,
    );
    const workers = await this.userService.findAllForAccount(user.account);
    const postsWithoutParentId = await this.postService.findAllWithoutParentId(
      user.account,
    );
    const organizations = await this.organizationService.findAllForAccount(
      user.account,
    );
    return {
      workers: workers,
      policies: policies,
      postsWithoutParentId: postsWithoutParentId,
      organizations: organizations,
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
      },
      parentPost: {
        id: '87af2eb9-a17d-4e78-b847-9d512cb9a0c9',
        postName: 'Дуболом',
        divisionName: 'Отдел дубней',
        parentId: null,
        product: 'Шмат',
        purpose: 'Дуболомить',
        createdAt: '2024-09-26T15:24:09.066Z',
        updatedAt: '2024-09-26T15:24:09.066Z',
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
        policy: null,
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
    parentPost: PostReadDto;
    workers: ReadUserDto[];
    organizations: OrganizationReadDto[];
    policiesWithoutPost: PolicyReadDto[];
  }> {
    const user = await this.userService.findOne(userId, ['account']);
    const post = await this.postService.findOneById(postId, [
      'policy',
      'user',
      'organization',
    ]);
    const parentPost =
      post.parentId !== null
        ? await this.postService.findOneById(post.parentId, [
            'policy',
            'user',
            'organization',
          ])
        : null;
    const workers = await this.userService.findAllForAccount(user.account);
    const organizations = await this.organizationService.findAllForAccount(
      user.account,
    );
    const policiesWithoutPost =
      await this.policyService.findAllActiveWithoutPost(user.account);
    this.logger.info(
      `${yellow('OK!')} - ${red(ip)} - CURRENT POST: ${JSON.stringify(post)} - Получить пост по ID!`,
    );
    return {
      currentPost: post,
      parentPost: parentPost,
      workers: workers,
      organizations: organizations,
      policiesWithoutPost: policiesWithoutPost,
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
    if (addPolicyId !== 'null') {
      const policy = await this.policyService.findOneById(addPolicyId);
      postCreateDto.policy = policy;
    }
    if (postCreateDto.responsibleUserId) {
      const responsibleUser = await this.userService.findOne(
        postCreateDto.responsibleUserId,
      );
      postCreateDto.user = responsibleUser;
    }
    if (postCreateDto.organizationId) {
      const organization = await this.organizationService.findOneById(
        postCreateDto.organizationId,
      );
      postCreateDto.organization = organization;
    }

    postCreateDto.account = user.account;
    const createdPostId = await this.postService.create(postCreateDto);

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
