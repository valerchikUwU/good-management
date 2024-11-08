import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConvertService } from "src/application/services/convert/convert.service";
import { UsersService } from "src/application/services/users/users.service";
import { ConvertCreateDto } from "src/contracts/convert/create-convert.dto";
import { ConvertReadDto } from "src/contracts/convert/read-convert.dto";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';
import { PostService } from "src/application/services/post/post.service";
import { ConvertGateway } from "src/gateways/convert.gateway";
import { MessageCreateDto } from "src/contracts/message/create-message.dto";
import { TypeConvert } from "src/domains/convert.entity";


@ApiTags('Converts')
@Controller(':userId/converts')
export class ConvertController {
  constructor(
    private readonly convertService: ConvertService,
    private readonly userService: UsersService,
    private readonly postService: PostService,
    private readonly convertGateway: ConvertGateway,
    @Inject('winston') private readonly logger: Logger,
  ) {

  }


  @Get()
  @ApiOperation({ summary: 'Все чаты' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: [
      {
        id: "222f1a02-d053-4885-99b6-f353eb277b6f",
        convertTheme: "Тема",
        expirationTime: "хз как еще реализовать",
        dateFinish: "2024-09-26T13:03:19.759Z",
        createdAt: "2024-10-21T13:10:51.781Z"
      }
    ]

  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async findAll(@Param('userId') userId: string): Promise<ConvertReadDto[]> {
    const user = await this.userService.findOne(userId, ['account']);
    const converts = await this.convertService.findAll(user.account);
    return converts;
  }


  @Get(':convertId')
  @ApiOperation({ summary: 'Чат по id' })
  @ApiResponse({
    status: HttpStatus.OK, description: "ОК!",
    example: {
      id: "27b360b3-7caf-48bd-a91a-5f7adef327de",
      convertTheme: "Разрешение на выделение курсанта для работ в другом корпусе",
      pathOfPosts: [
        "a4c907f0-cda3-4a95-9672-06ea07c70e54",
        "bea36fdf-d1b1-4979-87eb-8c298a10d9ce",
        "5bcd8e5d-e541-4360-9b8f-b0d7fb629174"
      ],
      expirationTime: "пока похуй",
      dateFinish: "2024-09-26T13:03:19.759Z",
      reatedAt: "2024-11-05T12:23:24.463Z",
      messages: [
        {
          id: "2621cfe3-db00-4e38-a229-eff8d61fa05c",
          content: "Разрешите мне с курсантом Лысенко выйти в туалет?",
          createdAt: "2024-11-05T12:23:25.591Z",
          updatedAt: "2024-11-05T12:23:25.591Z",
          sender: {
            id: "0d081ac3-200f-4c7c-adc8-d11f1f66b20a",
            firstName: "Игорь",
            lastName: "Вихорьков",
            middleName: "Дмитрич",
            telegramId: null,
            telephoneNumber: "+79787878777",
            avatar_url: null,
            vk_id: null,
            createdAt: "2024-11-04T10:06:29.775Z",
            updatedAt: "2024-11-04T10:06:29.775Z"
          }
        }
      ],
      convertToUsers: [
        {
          id: "c809248f-ae9c-4b7c-b681-d677dbd69887",
          createdAt: "2024-11-05T12:23:25.185Z",
          updatedAt: "2024-11-05T12:23:25.185Z",
          user: {
            id: "0d081ac3-200f-4c7c-adc8-d11f1f66b20a",
            firstName: "Игорь",
            lastName: "Вихорьков",
            middleName: "Дмитрич",
            telegramId: null,
            telephoneNumber: "+79787878777",
            avatar_url: null,
            vk_id: null,
            createdAt: "2024-11-04T10:06:29.775Z",
            updatedAt: "2024-11-04T10:06:29.775Z"
          }
        },
        {
          id: "d8852e4b-3629-4400-9213-1743ab58ed37",
          createdAt: "2024-11-05T12:23:25.461Z",
          updatedAt: "2024-11-05T12:23:25.461Z",
          user: {
            id: "3b809c42-2824-46c1-9686-dd666403402a",
            firstName: "Maxik",
            lastName: "Koval",
            middleName: null,
            telegramId: 453120600,
            telephoneNumber: "+79787513901",
            avatar_url: null,
            vk_id: null,
            createdAt: "2024-09-16T14:03:31.000Z",
            updatedAt: "2024-10-09T09:25:39.735Z"
          }
        }
      ],
      host: {
        id: "0d081ac3-200f-4c7c-adc8-d11f1f66b20a",
        firstName: "Игорь",
        lastName: "Вихорьков",
        middleName: "Дмитрич",
        telegramId: null,
        telephoneNumber: "+79787878777",
        avatar_url: null,
        vk_id: null,
        createdAt: "2024-11-04T10:06:29.775Z",
        updatedAt: "2024-11-04T10:06:29.775Z"
      }
    }

  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async findOne(@Param('convertId') convertId: string, @Ip() ip: string): Promise<ConvertReadDto> {
    const convert = await this.convertService.findOneById(convertId, ['convertToUsers.user', 'host', 'messages.sender']);
    const convertUserIds = convert.convertToUsers.map(convertToUser => convertToUser.user.id)
    console.log(convertUserIds);
    return convert;
  }

  @Post('new')
  @ApiOperation({ summary: 'Создать чат' })
  @ApiBody({
    description: 'ДТО для создания чата',
    type: ConvertCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED, description: "ОК!",
    example: {
      id: "27b360b3-7caf-48bd-a91a-5f7adef327de"
    }

  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  async create(@Param('userId') userId: string, @Query('userPostId') userPostId: string, @Query('reciverPostId') reciverPostId: string, @Body() convertCreateDto: ConvertCreateDto, @Ip() ip: string): Promise<{ id: string }> {
    const [user, postIdsFromSenderToTop, postIdsFromRecieverToTop] = await Promise.all([
      await this.userService.findOne(userId, ['account']),
      await this.postService.getHierarchyToTop(userPostId),
      await this.postService.getHierarchyToTop(reciverPostId)
    ])
    const isCommonDivision = postIdsFromSenderToTop.some(postId => postIdsFromRecieverToTop.includes(postId));
    const postIdsFromSenderToReciver: string[] = [];
    console.log(isCommonDivision)
    if(convertCreateDto.convertType === TypeConvert.DIRECT){
      postIdsFromSenderToReciver.push(userPostId, reciverPostId);
    }
    else if (isCommonDivision) {
      postIdsFromSenderToReciver.push(...(createPathInOneDivision(postIdsFromSenderToTop, postIdsFromRecieverToTop)));
    }
    else {
      postIdsFromRecieverToTop.reverse();
      postIdsFromSenderToReciver.push(...(postIdsFromSenderToTop.concat(postIdsFromRecieverToTop)));
    }
    // postIdsFromSenderToReciver.shift();
    console.log(postIdsFromSenderToTop)
    console.log(postIdsFromRecieverToTop)
    console.log(postIdsFromSenderToReciver)
    const firstPost = await this.postService.findOneById(postIdsFromSenderToReciver[1], ['user'])
    convertCreateDto.pathOfPosts = postIdsFromSenderToReciver;
    convertCreateDto.host = user;
    convertCreateDto.account = user.account;

    const createdConvert = await this.convertService.create(convertCreateDto);
    this.logger.info(`${yellow('OK!')} - ${red(ip)} - convertCreateDto: ${JSON.stringify(convertCreateDto)} - Создан новый чат!`)
    const createdConvertWithUsers = await this.convertService.findOneById(createdConvert.id, ['convertToUsers.user']);
    convertCreateDto.messageCreateDto.sender = user;
    convertCreateDto.messageCreateDto.convert = createdConvert;
    await this.convertGateway.handleSendingConvert(convertCreateDto.messageCreateDto, user, createdConvertWithUsers, firstPost.user.id);

    return { id: createdConvert.id };
  }
}


function createPathInOneDivision(arr1: string[], arr2: string[]) {
  // Элементы, которые есть в arr1, но нет в arr2
  const uniqueInArr1 = arr1.filter(el => !arr2.includes(el));

  // Первый общий элемент в arr1 и arr2
  const firstCommonElement = arr1.find(el => arr2.includes(el));

  // Элементы, которые есть в arr2, но нет в arr1, в реверсном порядке
  const uniqueInArr2Reversed = arr2.filter(el => !arr1.includes(el)).reverse();

  // Формирование результирующего массива
  const result = [...uniqueInArr1];
  if (firstCommonElement !== undefined) {
      result.push(firstCommonElement);
  }
  result.push(...uniqueInArr2Reversed);

  return result;
}