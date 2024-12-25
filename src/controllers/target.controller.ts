import { 
  Body, 
  Controller, 
  Get, 
  HttpStatus, 
  Inject, 
  Post, 
  Req, 
  UseGuards 
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
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
  @ApiOperation({ summary: 'Личные задачи и задачи из проектов' })
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
    @Req() req: ExpressRequest
  ): Promise<{
    userPosts: PostReadDto[];
    personalTargets: TargetReadDto[];
    projectTargets: TargetReadDto[];
  }> {
    const user = req.user as ReadUserDto;
    const userPosts = await this.postService.findAllForUser(user.id);
    const personalTargets = await this.targetService.findAllPersonal(user.id);
    const projectTargets = await this.targetService.findAllFromProjects(user.id);
    return { userPosts: userPosts, personalTargets: personalTargets, projectTargets: projectTargets };
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
    const createdTarget = await this.targetService.create(targetCreateDto)
    return { id: createdTarget.id };
  }
}
