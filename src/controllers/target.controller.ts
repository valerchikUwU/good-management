import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TargetService } from 'src/application/services/target/target.service';
import { TargetReadDto } from 'src/contracts/target/read-target.dto';
import { Logger } from 'winston';
import { Request as ExpressRequest } from 'express'
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { TargetCreateDto } from 'src/contracts/target/create-target.dto';
import { PostService } from 'src/application/services/post/post.service';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
import { yellow } from 'colorette';
import { TargetUpdateDto } from 'src/contracts/target/update-target.dto';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { AttachmentService } from 'src/application/services/attachment/attachment.service';

@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@ApiTags('Targets')
@Controller('targets')
export class TargetController {
  constructor(
    private readonly targetService: TargetService,
    private readonly postService: PostService,
    private readonly policyService: PolicyService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Личные задачи, задачи из проектов и приказы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "userPosts": [
        {
          "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "postName": "Post",
          "divisionName": "Подразделение №69",
          "divisionNumber": 69,
          "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
          "product": "fasf",
          "purpose": "sfsf",
          "createdAt": "2024-12-05T20:28:06.763Z",
          "updatedAt": "2024-12-05T20:28:06.763Z"
        },
        {
          "id": "261fcded-bb76-4956-a950-a19ab6e2c2fd",
          "postName": "Ковальская",
          "divisionName": "Подразделение №73",
          "divisionNumber": 11,
          "parentId": null,
          "product": "Ковальская",
          "purpose": "Ковальская",
          "createdAt": "2025-01-14T15:58:12.214Z",
          "updatedAt": "2025-01-14T15:58:12.214Z"
        }
      ],
      "personalTargets": [
        {
          "id": "b123fb06-4d9d-44c6-824a-100629fb764a",
          "type": "Личная",
          "orderNumber": 1,
          "content": "Контент задачи",
          "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "targetState": "Активная",
          "dateStart": "2024-12-25T10:45:37.697Z",
          "deadline": "2024-09-18T14:59:47.010Z",
          "dateComplete": null,
          "createdAt": "2024-12-25T10:45:37.923Z",
          "updatedAt": "2024-12-25T10:45:37.923Z"
        },
      ],
      "ordersTargets": [
        {
          "id": "qqqqfb06-4d9d-44c6-824a-100629fb764a",
          "type": "Приказ",
          "orderNumber": 1,
          "content": "Контент задачи",
          "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "targetState": "Активная",
          "dateStart": "2024-12-25T10:45:37.697Z",
          "deadline": "2024-09-18T14:59:47.010Z",
          "dateComplete": null,
          "createdAt": "2024-12-25T10:45:37.923Z",
          "updatedAt": "2024-12-25T10:45:37.923Z"
        },
      ],
      "projectTargets": [
        {
          "id": "a008fb06-4d9d-44c6-824a-100629fb764a",
          "type": "Продукт",
          "orderNumber": 1,
          "content": "Контент задачи",
          "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "targetState": "Активная",
          "dateStart": "2024-12-25T10:45:37.697Z",
          "deadline": "2024-09-18T14:59:47.010Z",
          "dateComplete": null,
          "createdAt": "2024-12-25T10:45:37.923Z",
          "updatedAt": "2024-12-25T10:45:37.923Z"
        },
      ]
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
  async findAll(
    @Req() req: ExpressRequest,
  ): Promise<{
    userPosts: PostReadDto[];
    personalTargets: TargetReadDto[];
    ordersTargets: TargetReadDto[];
    projectTargets: TargetReadDto[];
  }> {
    const user = req.user as ReadUserDto;
    const userPosts = await this.postService.findAllForUser(user.id, ['organization']);
    const userPostsIds = userPosts.map(post => post.id);
    const [personalTargets, orderTargets, projectTargets] = await Promise.all([
      this.targetService.findAllPersonalForUserPosts(userPostsIds, false, ['policy', 'attachmentToTargets.attachment']),
      this.targetService.findAllOrdersForUserPosts(userPostsIds, false, ['senderPost', 'attachmentToTargets.attachment']),
      this.targetService.findAllFromProjectsForUserPosts(userPostsIds, false)
    ]);
    return { userPosts: userPosts, personalTargets: personalTargets, ordersTargets: orderTargets, projectTargets: projectTargets }
  }



  @Get('archive')
  @ApiOperation({ summary: 'Личные задачи, задачи из проектов и приказы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "userPosts": [
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
          "organization": {
            "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
            "organizationName": "Калоеды",
            "parentOrganizationId": null,
            "reportDay": 4,
            "createdAt": "2024-12-04T13:14:47.767Z",
            "updatedAt": "2025-01-17T13:18:56.549Z"
          }
        },
        {
          "id": "261fcded-bb76-4956-a950-a19ab6e2c2fd",
          "postName": "Ковальская",
          "divisionName": "Подразделение №73",
          "divisionNumber": 11,
          "parentId": null,
          "product": "Ковальская",
          "purpose": "Ковальская",
          "createdAt": "2025-01-14T15:58:12.214Z",
          "updatedAt": "2025-01-14T15:58:12.214Z",
          "organization": {
            "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
            "organizationName": "Калоеды",
            "parentOrganizationId": null,
            "reportDay": 4,
            "createdAt": "2024-12-04T13:14:47.767Z",
            "updatedAt": "2025-01-17T13:18:56.549Z"
          }
        }
      ],
      "personalArchiveTargets": [
        {
          "id": "b123fb06-4d9d-44c6-824a-100629fb764a",
          "type": "Личная",
          "orderNumber": 1,
          "content": "Контент задачи",
          "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "targetState": "Активная",
          "dateStart": "2024-12-25T10:45:37.697Z",
          "deadline": "2024-09-18T14:59:47.010Z",
          "dateComplete": "2025-01-15T14:59:47.010Z",
          "createdAt": "2024-12-25T10:45:37.923Z",
          "updatedAt": "2024-12-25T10:45:37.923Z"
        },
      ],
      "ordersArchiveTargets": [
        {
          "id": "qqqqfb06-4d9d-44c6-824a-100629fb764a",
          "type": "Приказ",
          "orderNumber": 1,
          "content": "Контент задачи",
          "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "targetState": "Активная",
          "dateStart": "2024-12-25T10:45:37.697Z",
          "deadline": "2024-09-18T14:59:47.010Z",
          "dateComplete": "2025-01-15T14:59:47.010Z",
          "createdAt": "2024-12-25T10:45:37.923Z",
          "updatedAt": "2024-12-25T10:45:37.923Z"
        },
      ],
      "projectArchiveTargets": [
        {
          "id": "a008fb06-4d9d-44c6-824a-100629fb764a",
          "type": "Продукт",
          "orderNumber": 1,
          "content": "Контент задачи",
          "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
          "targetState": "Активная",
          "dateStart": "2024-12-25T10:45:37.697Z",
          "deadline": "2024-09-18T14:59:47.010Z",
          "dateComplete": "2025-01-15T14:59:47.010Z",
          "createdAt": "2024-12-25T10:45:37.923Z",
          "updatedAt": "2024-12-25T10:45:37.923Z"
        },
      ]
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
  async findAllArchive(
    @Req() req: ExpressRequest,
  ): Promise<{
    userPosts: PostReadDto[];
    personalArchiveTargets: TargetReadDto[];
    ordersArchiveTargets: TargetReadDto[];
    projectArchiveTargets: TargetReadDto[];
  }> {
    const user = req.user as ReadUserDto;
    const userPosts = await this.postService.findAllForUser(user.id, ['organization']);
    const userPostsIds = userPosts.map(post => post.id)
    const [personalArchiveTargets, orderArchiveTargets, projectArchiveTargets] = await Promise.all([
      this.targetService.findAllPersonalForUserPosts(userPostsIds, false, ['policy', 'attachmentToTarget.attachment']),
      this.targetService.findAllOrdersForUserPosts(userPostsIds, false, ['senderPost', 'attachmentToTarget.attachment']),
      this.targetService.findAllFromProjectsForUserPosts(userPostsIds, false)
    ]);
    return { userPosts: userPosts, personalArchiveTargets: personalArchiveTargets, ordersArchiveTargets: orderArchiveTargets, projectArchiveTargets: projectArchiveTargets };
  }




  @Post('new')
  @ApiOperation({ summary: 'Создать личную задачу' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
    ],
  })
  @ApiBody({
    description: 'ДТО для создания личной задачи',
    type: TargetCreateDto,
    required: true,
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
    @Body() targetCreateDto: TargetCreateDto
  ): Promise<{ id: string }> {

    const promises: Promise<void>[] = [];
    promises.push(
      this.postService.findOneById(targetCreateDto.holderPostId).then(post => {
        targetCreateDto.holderPost = post;
      }),
    );
    if (targetCreateDto.policyId) {
      promises.push(
        this.policyService.findOneById(targetCreateDto.policyId).then(policy => {
          targetCreateDto.policy = policy;
        }),
      );
    }
    await Promise.all(promises);
    const createdTarget = await this.targetService.create(targetCreateDto);
    this.logger.info(
      `${yellow('OK!')} - CREATED TARGET: ${JSON.stringify(targetCreateDto)} - Личная задача успешно создана!`,
    );
    return { id: createdTarget.id };
  }

  @Patch(':targetId/update')
  @ApiOperation({ summary: 'Обновить личную задачу по Id' })
  @ApiBody({
    description: 'ДТО для обновления задачи',
    type: TargetUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: { id: 'ed2dfe55-b678-4f7e-a82e-ccf395afae05' },
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
    description: `Задача не найдена!`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ name: 'targetId', required: true, description: 'Id задачи' })
  async update(
    @Param('targetId') targetId: string,
    @Body() targetUpdateDto: TargetUpdateDto,
  ): Promise<{ id: string }> {
    const promises: Promise<void>[] = [];
    if (targetUpdateDto.holderPostId) {
      promises.push(
        this.postService.findOneById(targetUpdateDto.holderPostId).then(post => {
          targetUpdateDto.holderPost = post;
        }),
      );
    }
    if (targetUpdateDto.policyId != null) {
      promises.push(
        this.policyService.findOneById(targetUpdateDto.policyId).then(policy => {
          targetUpdateDto.policy = policy;
        }),
      );
    }
    const updatedTargetId = await this.targetService.update(targetUpdateDto);

    this.logger.info(
      `${yellow('OK!')} - targetUpdateDto: ${JSON.stringify(targetUpdateDto)} - Задача успешно обновлена!`,
    );
    return { id: updatedTargetId };
  }


  @Delete(':targetId/remove')
  @ApiOperation({ summary: 'Удалить личную задачу' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: { "message": "Личная задача успешно удалена!" },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача не найдена!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })

  @ApiParam({
    name: 'targetId',
    required: true,
    description: 'Id личной задачи'
  })
  async remove(
    @Param('targetId') targetId: string,
  ) {
    await this.targetService.remove(targetId);
    return { message: "Личная задача успешно удалена!" }
  }

}
