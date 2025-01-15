import {
  Body,
  Controller,
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

@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@ApiTags('Targets')
@Controller('targets')
export class TargetController {
  constructor(
    private readonly targetService: TargetService,
    private readonly postService: PostService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Личные задачи, задачи из проектов и приказы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
    ],
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
    const userPosts = await this.postService.findAllForUser(user.id);
    const userPostsIds = userPosts.map(post => post.id)
    const personalTargets = await this.targetService.findAllPersonalForUserPosts(userPostsIds);
    const orderTargets = await this.targetService.findAllOrdersForUserPosts(userPostsIds);
    const projectTargets = await this.targetService.findAllFromProjectsForUserPosts(userPostsIds);
    return { userPosts: userPosts, personalTargets: personalTargets, ordersTargets: orderTargets, projectTargets: projectTargets };
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
      example: {id: 'ed2dfe55-b678-4f7e-a82e-ccf395afae05'},
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
  
      const updatedTargetId = await this.targetService.update(targetUpdateDto);
      
      this.logger.info(
        `${yellow('OK!')} - targetUpdateDto: ${JSON.stringify(targetUpdateDto)} - Задача успешно обновлена!`,
      );
      return { id: updatedTargetId };
    }
  
}
