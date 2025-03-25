import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { ConvertCreateDto } from 'src/contracts/convert/create-convert.dto';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { PostService } from 'src/application/services/post/post.service';
import { ConvertGateway } from 'src/gateways/convert.gateway';
import { PathConvert, TypeConvert } from 'src/domains/convert.entity';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request as ExpressRequest } from 'express'
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { TargetService } from 'src/application/services/target/target.service';
import { ConvertUpdateDto } from 'src/contracts/convert/update-convert.dto';
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { MessageService } from 'src/application/services/message/message.service';
import { findAllForContact, findOneConvertExample } from 'src/constants/swagger-examples/convert/convert-examples';
import { GetConvertGuard } from 'src/guards/getConvert.guard';
import { FinishConvertGuard } from 'src/guards/finishConvert.guard';

@ApiTags('Converts')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('converts')
export class ConvertController {
  constructor(
    private readonly convertService: ConvertService,
    private readonly messageService: MessageService,
    private readonly postService: PostService,
    private readonly targetService: TargetService,
    private readonly convertGateway: ConvertGateway,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get(':contactId/converts')
  @ApiOperation({ summary: 'Все конверты' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: findAllForContact
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
    name: 'contactId',
    required: true,
    description: 'Id контакта (поста)',
    example: '5fc5ec49-d658-4fe1-b4c9-7dd01d38a652',
  })
  async findAllForContact(
    @Req() req: ExpressRequest,
    @Param('contactId') contactId: string
  ): Promise<any> {
    let start = new Date()
    const user = req.user as ReadUserDto;
    const userPostsIds = user.posts.map(post => post.id);
    const [contact, convertsForContact, copiesForContact] = await Promise.all([
      this.postService.findOneById(contactId, ['user']),
      this.convertService.findAllForContact(userPostsIds, contactId),
      this.convertService.findAllCopiesForContact(userPostsIds, contactId)
    ])
    let c = new Date()
    let end = c.getTime() - start.getTime()
    console.log(`чаты ${end}`)
    return { contact: contact, convertsForContact: convertsForContact, copiesForContact: copiesForContact };
  }

  @Get(':convertId')
  @UseGuards(GetConvertGuard)
  @ApiOperation({ summary: 'Конверт по id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: findOneConvertExample
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `У вас нет доступа к этому чату!`
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Конверт не найден!`
  })
  @ApiParam({
    name: 'convertId',
    required: true,
    description: 'Id конверта',
    example: 'bdebb8ec-2a05-477c-93a8-463f60f3d2b5',
  })
  async findOne(
    @Param('convertId') convertId: string,
  ): Promise<ConvertReadDto> {
    const start = new Date()
    const convert = await this.convertService.findOneById(convertId, [
      'convertToPosts.post.user',
      'host.user.organization',
      'watchersToConvert.post.user'
    ]);
    const now = new Date()
    console.log(`чат по id ${now.getTime() - start.getTime()}`);
    return convert;
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать конверт' })
  @ApiBody({
    description: 'ДТО для создания конверта',
    type: ConvertCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'CREATED!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
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
    @Req() req: ExpressRequest,
    @Body() convertCreateDto: ConvertCreateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const userPost = user.posts.find(post => post.id === convertCreateDto.senderPostId);
    const [postIdsFromSenderToTop, postIdsFromRecieverToTop, targetHolderPost] =
      await Promise.all([ // если DIRECT то первые два запроса не нужны
        convertCreateDto.convertPath === PathConvert.DIRECT ? [] : this.postService.getHierarchyToTop(convertCreateDto.senderPostId),
        convertCreateDto.convertPath === PathConvert.DIRECT ? [] : this.postService.getHierarchyToTop(convertCreateDto.reciverPostId),
        this.postService.findOneById(convertCreateDto.reciverPostId),
      ]);
    const isCommonDivision = postIdsFromSenderToTop.some((postId) =>
      postIdsFromRecieverToTop.includes(postId),
    );
    const postIdsFromSenderToReciver: string[] = [];
    console.log(isCommonDivision); // ___________________________LOG
    if (convertCreateDto.convertPath === PathConvert.DIRECT) {
      postIdsFromSenderToReciver.push(convertCreateDto.senderPostId, convertCreateDto.reciverPostId);
    } else if (isCommonDivision) {
      postIdsFromSenderToReciver.push(
        ...createPathInOneDivision(
          postIdsFromSenderToTop,
          postIdsFromRecieverToTop,
        ),
      );
    } else {
      postIdsFromRecieverToTop.reverse();
      postIdsFromSenderToReciver.push(
        ...postIdsFromSenderToTop.concat(postIdsFromRecieverToTop),
      );
    }
    // postIdsFromSenderToReciver.shift();
    console.log(postIdsFromSenderToTop); // ___________________________LOG
    console.log(postIdsFromRecieverToTop); // ___________________________LOG
    console.log(postIdsFromSenderToReciver); // ___________________________LOG
    convertCreateDto.pathOfPosts = postIdsFromSenderToReciver;
    convertCreateDto.host = userPost;
    convertCreateDto.account = user.account;
    if (convertCreateDto.convertType === TypeConvert.ORDER) {
      convertCreateDto.targetCreateDto.holderPost = targetHolderPost;
      convertCreateDto.targetCreateDto.senderPost = userPost;
    }


    const [createdConvert, activePost] =
      await Promise.all([
        this.convertService.create(convertCreateDto),
        this.postService.findOneById(convertCreateDto.pathOfPosts[1], ['user']),
      ]);

    const messageCreateDto: MessageCreateDto = {
      content: createdConvert.convertType === TypeConvert.ORDER ? convertCreateDto.targetCreateDto.content : convertCreateDto.messageContent,
      postId: convertCreateDto.senderPostId,
      convert: createdConvert,
      sender: userPost
    }
    await Promise.all([
      convertCreateDto.convertType === TypeConvert.ORDER ? this.targetService.create(convertCreateDto.targetCreateDto) : null,
      await this.messageService.create(messageCreateDto)
    ]);


    // Если у поста есть юзер, то прокидывать сокет
    if (activePost.user !== null) {
      const index = createdConvert.pathOfPosts.indexOf(userPost.id);
      const pathOfPostsWithoutHostPost = createdConvert.pathOfPosts.splice(index, 1);
      createdConvert.host.user = user;
      createdConvert.host.user.posts = null;
      this.convertGateway.handleConvertExtensionEvent(createdConvert.id, createdConvert.host, activePost, pathOfPostsWithoutHostPost)
    }
    this.logger.info(
      `${yellow('OK!')} - convertCreateDto: ${JSON.stringify(convertCreateDto)} - Создан новый конверт!`,
    );
    return { id: createdConvert.id };
  }

  @Patch(':convertId/approve') // в guard проверку на host.user.id и что activePostId не последний в массиве
  @ApiOperation({ summary: 'Продолжить конверт (аппрувнуть) его по pathOfPosts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
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
    name: 'convertId',
    required: true,
    description: 'Id конверта',
    example: 'bdebb8ec-2a05-477c-93a8-463f60f3d2b5',
  })
  async approve(
    @Param('convertId') convertId: string,
  ): Promise<string> {
    const convert = await this.convertService.findOneById(convertId, ['convertToPosts.post']);
    const postsInConvertIds = convert.convertToPosts.map(convertToPost => convertToPost.post.id);
    const indexOfActivePostId = convert.pathOfPosts.indexOf(convert.activePostId);
    const nextPost = await this.postService.findOneById(convert.pathOfPosts[indexOfActivePostId + 1]);
    const newConvertToPostIds = postsInConvertIds.concat(nextPost.id);
    const convertUpdateDto: ConvertUpdateDto = {
      _id: convert.id,
      activePostId: convert.pathOfPosts[indexOfActivePostId + 1],
      convertToPostIds: newConvertToPostIds,
    };
    const finishedConvertId = await this.convertService.update(convertUpdateDto._id, convertUpdateDto);

    return finishedConvertId;
  }


  @Patch(':convertId/approve')
  @UseGuards(FinishConvertGuard)
  @ApiOperation({ summary: 'Завершить конверт' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
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
    name: 'convertId',
    required: true,
    description: 'Id конверта',
    example: 'bdebb8ec-2a05-477c-93a8-463f60f3d2b5',
  })
  async finish(
    @Param('convertId') convertId: string,
  ): Promise<string> {
    const convertUpdateDto: ConvertUpdateDto = {
      _id: convertId,
      convertStatus: false,
    };
    const finishedConvertId = await this.convertService.update(convertUpdateDto._id, convertUpdateDto);

    return finishedConvertId;
  }


  @Patch(':convertId/update')
  @UseGuards(FinishConvertGuard)
  @ApiOperation({ summary: 'Обновить конверт' })
  @ApiBody({
    description: 'ДТО для обновления конверта',
    type: ConvertUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
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
    name: 'convertId',
    required: true,
    description: 'Id конверта',
    example: 'bdebb8ec-2a05-477c-93a8-463f60f3d2b5',
  })
  async update(
    @Param('convertId') convertId: string,
    @Body() convertUpdateDto: ConvertUpdateDto
  ): Promise<string> {
    const finishedConvertId = await this.convertService.update(convertUpdateDto._id, convertUpdateDto);
    return finishedConvertId;
  }
}




function createPathInOneDivision(arr1: string[], arr2: string[]) {
  // Элементы, которые есть в arr1, но нет в arr2
  const uniqueInArr1 = arr1.filter((el) => !arr2.includes(el));

  // Первый общий элемент в arr1 и arr2
  const firstCommonElement = arr1.find((el) => arr2.includes(el));

  // Элементы, которые есть в arr2, но нет в arr1, в реверсном порядке
  const uniqueInArr2Reversed = arr2
    .filter((el) => !arr1.includes(el))
    .reverse();

  // Формирование результирующего массива
  const result = [...uniqueInArr1];
  if (firstCommonElement !== undefined) {
    result.push(firstCommonElement);
  }
  result.push(...uniqueInArr2Reversed);

  return result;
}
