import {
  Body,
  Controller,
  ForbiddenException,
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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { UsersService } from 'src/application/services/users/users.service';
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
import { PostReadDto } from 'src/contracts/post/read-post.dto';

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

  @Get()
  @ApiOperation({ summary: 'Все чаты' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        "id": "a9b4df3a-09d7-4489-8985-ce4090ea090f",
        "convertTheme": "сука сосаааааааааать",
        "pathOfPosts": [
          "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
          "240d67da-d6d1-40c0-9391-8ceab74aeb6f"
        ],
        "expirationTime": 999,
        "convertType": "Приказ",
        "convertPath": "Прямой",
        "convertStatus": true,
        "activePostId": "240d67da-d6d1-40c0-9391-8ceab74aeb6f",
        "dateFinish": "2025-02-11T00:00:00.000Z",
        "createdAt": "2025-02-11T15:15:55.783Z",
        "convertToPosts": [
          {
            "id": "55aad076-be20-4cfa-a725-ea1815e33f68",
            "createdAt": "2025-02-11T15:15:55.990Z",
            "updatedAt": "2025-02-11T15:15:55.990Z",
            "post": {
              "id": "240d67da-d6d1-40c0-9391-8ceab74aeb6f",
              "postName": "socket",
              "divisionName": "Подразделение №73",
              "divisionNumber": 17,
              "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
              "product": "ccc",
              "purpose": "ccc",
              "createdAt": "2025-02-11T15:09:07.533Z",
              "updatedAt": "2025-02-11T15:09:07.533Z",
              "user": {
                "id": "bc807845-08a8-423e-9976-4f60df183ae2",
                "firstName": "Максим",
                "lastName": "Ковальская",
                "middleName": "Тимофеевич",
                "telegramId": 453120600,
                "telephoneNumber": "+79787513901",
                "avatar_url": null,
                "vk_id": null,
                "createdAt": "2024-12-04T16:16:56.785Z",
                "updatedAt": "2025-01-10T17:14:37.056Z"
              }
            }
          }
        ]
      },
    ]
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async findAll(@Req() req: ExpressRequest): Promise<any[]> {
    const user = req.user as ReadUserDto;
    const userPostsIds = user.posts.map(post => post.id)
    const postsWithConverts = await this.postService.findAllPostsWithConvertsForCurrentUser(userPostsIds)
    return postsWithConverts;
  }

  @Get(':convertId')
  @ApiOperation({ summary: 'Чат по id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
      convertTheme:
        'Разрешение на выделение курсанта для работ в другом корпусе',
      pathOfPosts: [
        'a4c907f0-cda3-4a95-9672-06ea07c70e54',
        'bea36fdf-d1b1-4979-87eb-8c298a10d9ce',
        '5bcd8e5d-e541-4360-9b8f-b0d7fb629174',
      ],
      expirationTime: 'пока похуй',
      dateFinish: '2024-09-26T13:03:19.759Z',
      reatedAt: '2024-11-05T12:23:24.463Z',
      messages: [
        {
          id: '2621cfe3-db00-4e38-a229-eff8d61fa05c',
          content: 'Разрешите мне с курсантом Лысенко выйти в туалет?',
          createdAt: '2024-11-05T12:23:25.591Z',
          updatedAt: '2024-11-05T12:23:25.591Z',
          sender: {
            id: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
            firstName: 'Игорь',
            lastName: 'Вихорьков',
            middleName: 'Дмитрич',
            telegramId: null,
            telephoneNumber: '+79787878777',
            avatar_url: null,
            vk_id: null,
            createdAt: '2024-11-04T10:06:29.775Z',
            updatedAt: '2024-11-04T10:06:29.775Z',
          },
        },
      ],
      convertToUsers: [
        {
          id: 'c809248f-ae9c-4b7c-b681-d677dbd69887',
          createdAt: '2024-11-05T12:23:25.185Z',
          updatedAt: '2024-11-05T12:23:25.185Z',
          user: {
            id: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
            firstName: 'Игорь',
            lastName: 'Вихорьков',
            middleName: 'Дмитрич',
            telegramId: null,
            telephoneNumber: '+79787878777',
            avatar_url: null,
            vk_id: null,
            createdAt: '2024-11-04T10:06:29.775Z',
            updatedAt: '2024-11-04T10:06:29.775Z',
          },
        },
        {
          id: 'd8852e4b-3629-4400-9213-1743ab58ed37',
          createdAt: '2024-11-05T12:23:25.461Z',
          updatedAt: '2024-11-05T12:23:25.461Z',
          user: {
            id: 'bc807845-08a8-423e-9976-4f60df183ae2',
            firstName: 'Maxik',
            lastName: 'Koval',
            middleName: null,
            telegramId: 453120600,
            telephoneNumber: '+79787513901',
            avatar_url: null,
            vk_id: null,
            createdAt: '2024-09-16T14:03:31.000Z',
            updatedAt: '2024-10-09T09:25:39.735Z',
          },
        },
      ],
      host: {
        id: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
        firstName: 'Игорь',
        lastName: 'Вихорьков',
        middleName: 'Дмитрич',
        telegramId: null,
        telephoneNumber: '+79787878777',
        avatar_url: null,
        vk_id: null,
        createdAt: '2024-11-04T10:06:29.775Z',
        updatedAt: '2024-11-04T10:06:29.775Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async findOne(
    @Req() req: ExpressRequest,
    @Param('convertId') convertId: string,
  ): Promise<ConvertReadDto> {
    const user = req.user as ReadUserDto;
    const convert = await this.convertService.findOneById(convertId, [
      'convertToPosts.post.user',
      'host',
      'messages.sender',
    ]);
    const userIdsInConvert = convert.convertToPosts.map(convertToPost => convertToPost.post.user.id)
    if (userIdsInConvert.includes(user.id)) {
      return convert;
    }
    else {
      const err = new ForbiddenException('У вас нет доступа к этому чату!');
      this.logger.error(err)
      throw err;
    }
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
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
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
    const userPost = user.posts.find(post => post.id === convertCreateDto.senderPostId)
    const [postIdsFromSenderToTop, postIdsFromRecieverToTop, targetHolderPost] =
      await Promise.all([ // условие на DIRECT поставить выше чтобы не выолнять лишние запросы к БД
        this.postService.getHierarchyToTop(convertCreateDto.senderPostId),
        this.postService.getHierarchyToTop(convertCreateDto.reciverPostId),
        this.postService.findOneById(convertCreateDto.reciverPostId),
      ]);
    const isCommonDivision = postIdsFromSenderToTop.some((postId) =>
      postIdsFromRecieverToTop.includes(postId),
    );
    const postIdsFromSenderToReciver: string[] = [];
    console.log(isCommonDivision);
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
    console.log(postIdsFromSenderToTop);
    console.log(postIdsFromRecieverToTop);
    console.log(postIdsFromSenderToReciver);
    convertCreateDto.pathOfPosts = postIdsFromSenderToReciver;
    convertCreateDto.host = userPost;
    convertCreateDto.account = user.account;
    convertCreateDto.targetCreateDto.holderPost = targetHolderPost;
    convertCreateDto.targetCreateDto.senderPost = userPost;
    const [targetId, createdConvert, activePost] =
      await Promise.all([
        this.targetService.create(convertCreateDto.targetCreateDto),
        this.convertService.create(convertCreateDto),
        this.postService.findOneById(convertCreateDto.pathOfPosts[1], ['user'])
      ]);
    if (activePost.user.id) {
      this.convertGateway.handleConvertExtensionEvent(createdConvert, activePost.user.id)
    }
    this.logger.info(
      `${yellow('OK!')} - convertCreateDto: ${JSON.stringify(convertCreateDto)} - Создан новый конверт!`,
    );
    return { id: createdConvert.id };
  }

  @Patch(':convertId/approve')
  @ApiOperation({ summary: 'Завершить конверт' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async approve(
    @Param('convertId') convertId: string,
  ): Promise<string> {
    const convert = await this.convertService.findOneById(convertId);
    const convertUpdateDto: ConvertUpdateDto = {
      _id: convert.id,
      convertStatus: false,
    };
    const finishedConvertId = await this.convertService.update(convertUpdateDto._id, convertUpdateDto);
    return finishedConvertId;
    // const nextPost = await this.postService.findOneById(convert.pathOfPosts[indexOfActivePostId + 1]); // МОЖЕТ БЫТЬ NULL когда последний пост, соответственно аккуратно с nextPost.user.id
    // const newConvertToPostIds = payload.convertToPostIds.concat(nextPost.id);
    // const convertUpdateDto: ConvertUpdateDto = {
    //   _id: convert.id,
    //   convertToPostIds: newConvertToPostIds,
    //   activePostId: nextPost.id,
    // };
    // await this.convertService.update(convertUpdateDto._id, convertUpdateDto);

    // return { success: true, message: 'Одобрение выполнено успешно' };
  }


  @Patch(':convertId/sendMessage')
  @ApiOperation({ summary: 'Отправить сообщение' })
  @ApiBody({
    description: 'ДТО для создания сообщения',
    type: MessageCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: {
      id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async sendMessage(
    @Req() req: ExpressRequest,
    @Param('convertId') convertId: string,
    @Body() messageCreateDto: MessageCreateDto
  ): Promise<string> {
    const user = req.user as ReadUserDto;
    const userSenderPost = user.posts.find(post => post.id === messageCreateDto.postId)
    const convert = await this.convertService.findOneById(convertId);
    messageCreateDto.convert = convert;
    messageCreateDto.sender = userSenderPost;
    const createdMessage = await this.messageService.create(messageCreateDto);
    this.convertGateway.handleMessageCreationEvent(convertId, createdMessage);
    return createdMessage.id;
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
