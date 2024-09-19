import { Body, Controller, Get, HttpStatus, Param, Post, Query } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { PolicyService } from "src/application/services/policy/policy.service";
import { PostService } from "src/application/services/post/post.service";
import { UsersService } from "src/application/services/users/users.service";
import { PostCreateDto } from "src/contracts/post/create-post.dto";
import { PostReadDto } from "src/contracts/post/read-post.dto";
import { ReadUserDto } from "src/contracts/user/read-user.dto";
import { Organization } from "src/domains/organization.entity";
import { User } from "src/domains/user.entity";




@ApiTags('Posts')
@Controller(':userId/posts')
export class PostController {

    constructor(private readonly postService: PostService,
        private readonly userService: UsersService,
        private readonly policyService: PolicyService,
        private readonly organizationService: OrganizationService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все посты' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example:
            [
                {
                    id: '3be0dd3f-db96-46ef-b4a7-12221e74bb47',
                    postName: 'Генеральный пердун',
                    divisionName: 'Отдел по отделам',
                    user: {
                        type: User
                    },
                    createdAt: "1900-01-01 00:00:00",
                    updatedAt: "1900-01-01 00:00:00",
                    organization: {
                        type: Organization
                    }
                }
            ]
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(@Param('userId') userId: string): Promise<PostReadDto[]> {
        return await this.postService.findAll()
    }


    @Get(':postId')
    async findOne(@Param('userId') userId: string, @Param('postId') postId: string): Promise<{postReadDto: PostReadDto, workers: ReadUserDto[], posts: PostReadDto[]}>{
        const user = await this.userService.findOne(userId);
        const post = await this.postService.findeOneById(postId);
        const workers = await this.userService.findAllForAccount(user.account);
        const posts = await this.postService.findAllForAccount(user.account);

        return {postReadDto: post, workers: workers, posts: posts}
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
                divisionName: "главный",
                parentId: null,
                product: "Продукт",
                purpose: "Цель",
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
                id: "bb843716-8081-407a-b797-5a97c29306f1",
                createdAt: "2024-09-17T13:13:18.791Z",
                updatedAt: "2024-09-17T13:13:18.791Z"
              
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiQuery({ name: 'addPolicyId', required: false, description: 'Id политики' })
    async create(@Param('userId') userId: string, @Body() postCreateDto: PostCreateDto, @Query('addPolicyId') addPolicyId?: string): Promise<PostCreateDto>{
        const user = await this.userService.findOne(userId);
        console.log(user)
        if(addPolicyId !== undefined){
            const policy = await this.policyService.findeOneById(addPolicyId)
            postCreateDto.policy = policy
        }
        postCreateDto.user = user;
        const organization = await this.organizationService.findOneById(postCreateDto.organizationId)
        postCreateDto.organization = organization;
        return this.postService.create(postCreateDto);
    }
}   