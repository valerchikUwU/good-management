import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Patch, Post, Query } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { PolicyService } from "src/application/services/policy/policy.service";
import { PostService } from "src/application/services/post/post.service";
import { UsersService } from "src/application/services/users/users.service";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { PostCreateDto } from "src/contracts/post/create-post.dto";
import { PostReadDto } from "src/contracts/post/read-post.dto";
import { ReadUserDto } from "src/contracts/user/read-user.dto";
import { Post as PostModel}  from "src/domains/post.entity";
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PostUpdateDto } from "src/contracts/post/update-post.dto";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";




@ApiTags('Posts')
@Controller(':userId/posts')
export class PostController {

    constructor(private readonly postService: PostService,
        private readonly userService: UsersService,
        private readonly policyService: PolicyService,
        private readonly organizationService: OrganizationService,
        @Inject('winston') private readonly logger: Logger
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все посты' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example:
        [
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
    async findAll(@Param('userId') userId: string, @Ip() ip: string): Promise<PostReadDto[]> {
        const user = await this.userService.findOne(userId);
        const posts = await this.postService.findAllForAccount(user.account);
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
        status: HttpStatus.OK, description: "ОК!",
        example: {
          id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
          postName: "Чурка",
          divisionName: "Отдел дубней",
          parentId: "87af2eb9-a17d-4e78-b847-9d512cb9a0c9",
          product: "Продукт",
          purpose: "Предназначение поста",
          createdAt: "2024-09-20T15:09:14.997Z",
          updatedAt: "2024-09-26T15:44:35.934Z",
          user: {
            id: "3b809c42-2824-46c1-9686-dd666403402a",
            firstName: "Maxik",
            lastName: "Koval",
            telegramId: 453120600,
            telephoneNumber: null,
            avatar_url: null,
            vk_id: null,
            createdAt: "2024-09-16T14:03:31.000Z",
            updatedAt: "2024-09-16T14:03:31.000Z",
            organization: {
              id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
              organizationName: "soplya firma",
              parentOrganizationId: null,
              createdAt: "2024-09-16T14:24:33.841Z",
              updatedAt: "2024-09-16T14:24:33.841Z"
            },
            account: {
              id: "a1118813-8985-465b-848e-9a78b1627f11",
              accountName: "OOO PIPKA",
              createdAt: "2024-09-16T12:53:29.593Z",
              updatedAt: "2024-09-16T12:53:29.593Z"
            }
          },
          organization: {
            id: "1f1cca9a-2633-489c-8f16-cddd411ff2d0",
            organizationName: "OOO BOBRIK",
            parentOrganizationId: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
            createdAt: "2024-09-16T15:09:48.995Z",
            updatedAt: "2024-09-16T15:09:48.995Z"
          }
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Пост не найдена!` })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'postId', required: true, description: 'Id поста' })
    async update(@Param('postId') postId: string, @Body() postUpdateDto: PostUpdateDto, @Ip() ip: string): Promise<PostReadDto> {
        if(postUpdateDto.userId) {
          const responsibleUser = await this.userService.findOne(postUpdateDto.userId)
          postUpdateDto.user = responsibleUser;
        } 
        if(postUpdateDto.organizationId) {
          const organization = await this.organizationService.findOneById(postUpdateDto.organizationId)
          postUpdateDto.organization = organization;
        } 
        const updatedPost = await this.postService.update(postId, postUpdateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - UPDATED POST: ${JSON.stringify(postUpdateDto)} - Пост успешно обновлен!`);
        return updatedPost;
    }

    @Get('new')
    @ApiOperation({summary: 'Получить данные для создания поста'})
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example:
        {
          workers: [
            {
              id: "3b809c42-2824-46c1-9686-dd666403402a",
              firstName: "Maxik",
              lastName: "Koval",
              telegramId: 453120600,
              telephoneNumber: null,
              avatar_url: null,
              vk_id: null,
              createdAt: "2024-09-16T14:03:31.000Z",
              updatedAt: "2024-09-16T14:03:31.000Z"
            }
          ],
          policies: [
            {
              id: "f6e3ac1f-afd9-42c1-a9f3-d189961c325c",
              policyName: "Пипка",
              policyNumber: 2,
              state: "Черновик",
              type: "Директива",
              dateActive: null,
              content: "попа",
              createdAt: "2024-09-18T15:06:52.222Z",
              updatedAt: "2024-09-18T15:06:52.222Z"
            }
          ]
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async beforeCreate(@Param('userId') userId: string, @Ip() ip: string): Promise<{workers: ReadUserDto[], policies: PolicyReadDto[], postsWithoutParentId: PostReadDto[], organizations: OrganizationReadDto[]}>{
      const user = await this.userService.findOne(userId);
      const policies = await this.policyService.findAllWithoutPost(user.account);
      const workers = await this.userService.findAllForAccount(user.account);
      const postsWithoutParentId = await this.postService.findAllWithoutParentId(user.account);
      const organizations = await this.organizationService.findAllForAccount(user.account)
      return {workers: workers, policies: policies, postsWithoutParentId: postsWithoutParentId, organizations: organizations};
    }


    @Get(':postId')
    @ApiOperation({ summary: 'Получить пост по id' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example:
        {
            currentPost: {
              id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
              postName: "Директор",
              divisionName: "Отдел продаж",
              parentId: null,
              product: "Продукт",
              purpose: "Предназначение поста",
              createdAt: "2024-09-20T15:09:14.997Z",
              updatedAt: "2024-09-20T15:09:14.997Z"
            },
            parentPost: {
              id: "87af2eb9-a17d-4e78-b847-9d512cb9a0c9",
              postName: "Дуболом",
              divisionName: "Отдел дубней",
              parentId: null,
              product: "Шмат",
              purpose: "Дуболомить",
              createdAt: "2024-09-26T15:24:09.066Z",
              updatedAt: "2024-09-26T15:24:09.066Z",
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
              policy: null
            },
            workers: [
              {
                id: "3b809c42-2824-46c1-9686-dd666403402a",
                firstName: "Maxik",
                lastName: "Koval",
                telegramId: 453120600,
                telephoneNumber: null,
                avatar_url: null,
                vk_id: null,
                createdAt: "2024-09-16T14:03:31.000Z",
                updatedAt: "2024-09-16T14:03:31.000Z"
              }
            ],
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
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Пост не найден!` })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findOne(@Param('userId') userId: string, @Param('postId') postId: string, @Ip() ip: string): Promise<{currentPost: PostReadDto, parentPost: PostReadDto, workers: ReadUserDto[], posts: PostReadDto[]}>{
        const user = await this.userService.findOne(userId);
        const post = await this.postService.findOneById(postId);
        const parentPost = await this.postService.findOneById(post.parentId)
        const workers = await this.userService.findAllForAccount(user.account);
        const posts = await this.postService.findAllForAccount(user.account);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - CURRENT POST: ${JSON.stringify(post)} - Получить пост по ID!`);
        return {currentPost: post, parentPost: parentPost, workers: workers, posts: posts}
    }



    @Post('new')
    @ApiOperation({ summary: 'Создать пост' })
    @ApiBody({
        description: 'ДТО для создания поста',
        type: PostCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            postName: "Директор",
            divisionName: "Отдел продаж",
            parentId: null,
            product: "Продукт",
            purpose: "Предназначение поста",
            user: {
              id: "3b809c42-2824-46c1-9686-dd666403402a",
              firstName: "Maxik",
              lastName: "Koval",
              telegramId: 453120600,
              telephoneNumber: null,
              avatar_url: null,
              vk_id: null,
              createdAt: "2024-09-16T14:03:31.000Z",
              updatedAt: "2024-09-16T14:03:31.000Z",
              organization: {
                id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
                organizationName: "soplya firma",
                parentOrganizationId: null,
                createdAt: "2024-09-16T14:24:33.841Z",
                updatedAt: "2024-09-16T14:24:33.841Z"
              },
              account: {
                id: "a1118813-8985-465b-848e-9a78b1627f11",
                accountName: "OOO PIPKA",
                createdAt: "2024-09-16T12:53:29.593Z",
                updatedAt: "2024-09-16T12:53:29.593Z"
              }
            },
            organization: {
              id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
              organizationName: "soplya firma",
              parentOrganizationId: null,
              createdAt: "2024-09-16T14:24:33.841Z",
              updatedAt: "2024-09-16T14:24:33.841Z"
            },
            policy: {
              id: "f6e3ac1f-afd9-42c1-a9f3-d189961c325c",
              policyName: "Пипка",
              policyNumber: 2,
              state: "Черновик",
              type: "Директива",
              dateActive: null,
              content: "попа",
              createdAt: "2024-09-18T15:06:52.222Z",
              updatedAt: "2024-09-18T15:06:52.222Z"
            },
            account: {
              id: "a1118813-8985-465b-848e-9a78b1627f11",
              accountName: "OOO PIPKA",
              createdAt: "2024-09-16T12:53:29.593Z",
              updatedAt: "2024-09-16T12:53:29.593Z"
            },
            id: "2420fabb-3e37-445f-87e6-652bfd5a050c",
            createdAt: "2024-09-20T15:09:14.997Z",
            updatedAt: "2024-09-20T15:09:14.997Z"
          }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Ошибка валидации!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiQuery({ name: 'addPolicyId', required: false, description: 'Id политики' })
    async create(@Param('userId') userId: string, @Body() postCreateDto: PostCreateDto, @Ip() ip: string, @Query('addPolicyId') addPolicyId?: string): Promise<PostModel>
    //PostModel из за конфликтующих импортов
    {
        const user = await this.userService.findOne(userId);
        if(addPolicyId !== undefined){
            const policy = await this.policyService.findOneById(addPolicyId)
            postCreateDto.policy = policy
        }
        const responsibleUser = await this.userService.findOne(postCreateDto.userId);
        postCreateDto.user = responsibleUser;
        postCreateDto.account = user.account;
        const organization = await this.organizationService.findOneById(postCreateDto.organizationId)
        postCreateDto.organization = organization;
        const createdPost = await this.postService.create(postCreateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - postCreateDto: ${JSON.stringify(postCreateDto)} - Создан новый пост!`)
        return createdPost;
    }
}   