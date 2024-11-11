import {
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { MessageService } from 'src/application/services/message/message.service';
import { PostService } from 'src/application/services/post/post.service';
import { UsersService } from 'src/application/services/users/users.service';
import { ConvertCreateDto } from 'src/contracts/convert/create-convert.dto';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { ConvertUpdateDto } from 'src/contracts/convert/update-convert.dto';
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { TypeConvert } from 'src/domains/convert.entity';
import { Logger } from 'winston';

@WebSocketGateway(5001, { namespace: 'chat', cors: '*:*' })
export class ConvertGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UsersService,
    private readonly convertService: ConvertService,
    private readonly postService: PostService,
    @Inject('winston') private readonly logger: Logger, // инъекция логгера
  ) {}
  private clients: Map<string, Socket> = new Map();
  @WebSocketServer() ws: Server;

  afterInit(server: Server) {
    this.logger.info(`WebSocket for chat initialized`);
  }

  async handleSendingConvert(
    message: MessageCreateDto,
    sender: ReadUserDto,
    convert: ConvertReadDto,
    userIdOfFirstPost: string,
  ) {
    this.ws.to(convert.id).emit('convertEmit', message); // broadcast messages
    const convertUserIds = convert.convertToUsers.map(
      (convertToUser) => convertToUser.user.id,
    );
    convertUserIds.push(userIdOfFirstPost);
    const convertUpdateDto: ConvertUpdateDto = {
      _id: convert.id,
      userIds: convertUserIds,
      pathOfPosts: convert.pathOfPosts,
      activeUserId: convert.pathOfPosts[1],
    };
    await this.convertService.update(convertUpdateDto._id, convertUpdateDto);
    message.convert = convert;
    message.sender = sender;
    await this.messageService.create(message);
    return true;
  }

  @SubscribeMessage('approve')
  async handleApproval(
    @MessageBody()
    payload: {
      isApproved: boolean;
      message: MessageCreateDto;
      sender: ReadUserDto;
      convert: ConvertReadDto;
    },
  ) {
    try {
      const startTime = Date.now(); // Записываем начальное время
      this.logger.info(JSON.stringify(payload));
      const postOfSender = await this.postService.findOneById(
        payload.convert.activeUserId,
        ['user'],
      );
      console.log(JSON.stringify(postOfSender));
      if (postOfSender.user.id === payload.sender.id) {
        this.ws.to(payload.convert.id).emit('convertEmit', payload.message); // broadcast messages
        payload.message.convert = payload.convert;
        payload.message.sender = payload.sender;
        await this.messageService.create(payload.message);
        const indexOfActivePostId = payload.convert.pathOfPosts.indexOf(
          payload.convert.activeUserId,
        );
        if (payload.isApproved) {
          const convertUserIds = payload.convert.convertToUsers.map(
            (convertToUser) => convertToUser.user.id,
          );
          console.log(indexOfActivePostId);
          const nextPost = await this.postService.findOneById(
            payload.convert.pathOfPosts[indexOfActivePostId + 1],
            ['user'],
          ); // МОЖЕТ БЫТЬ NULL когда последний пост, соответственно аккуратно с nextPost.user.id
          convertUserIds.push(nextPost.user.id);
          const convertUpdateDto: ConvertUpdateDto = {
            _id: payload.convert.id,
            userIds: convertUserIds,
            activeUserId: nextPost.user.id,
          };
          await this.convertService.update(
            convertUpdateDto._id,
            convertUpdateDto,
          );
          this.ws.to(payload.convert.id).emit('convertEmit', payload.message); // НЕ ЯСНО НУЖНО ЛИ ДУБЛИРОВАТЬ СООБЩЕНИЕ С ЗАПРОСОМ

          const endTime = Date.now(); // Записываем конечное время
          const executionTime = endTime - startTime; // Рассчитываем время выполнения
          console.log(executionTime);
          return true;
        } else if (payload.convert.convertType === TypeConvert.COORDINATION) {
          const previousPost = await this.postService.findOneById(
            payload.convert.pathOfPosts[indexOfActivePostId - 1],
            ['user'],
          );
          const reversedPath = payload.convert.pathOfPosts.reverse();

          const convertUpdateDto: ConvertUpdateDto = {
            _id: payload.convert.id,
            pathOfPosts: reversedPath,
            activeUserId: previousPost.user.id,
          };
          await this.convertService.update(
            convertUpdateDto._id,
            convertUpdateDto,
          );
        }
      } else
        throw new ForbiddenException(
          'У вас нет прав для работы с этим конвертом!',
        );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException('Ошибка при одобрении конверта!');
    }
  }

  @SubscribeMessage('seen')
  async handleSeenCoordination(
    @MessageBody()
    payload: {
      message: MessageCreateDto;
      sender: ReadUserDto;
      convert: ConvertReadDto;
    },
  ) {
    try {
      const startTime = Date.now(); // Записываем начальное время
      this.logger.info(JSON.stringify(payload));
      const postOfSender = await this.postService.findOneById(
        payload.convert.activeUserId,
        ['user'],
      );
      console.log(JSON.stringify(postOfSender));
      if (postOfSender.user.id === payload.sender.id) {
        this.ws.to(payload.convert.id).emit('convertEmit', payload.message); // broadcast messages
        payload.message.convert = payload.convert;
        payload.message.sender = payload.sender;
        await this.messageService.create(payload.message);
        const indexOfActivePostId = payload.convert.pathOfPosts.indexOf(
          payload.convert.activeUserId,
        );
        const convertUserIds = payload.convert.convertToUsers.map(
          (convertToUser) => convertToUser.user.id,
        );
        const nextPost = await this.postService.findOneById(
          payload.convert.pathOfPosts[indexOfActivePostId + 1],
          ['user'],
        );
        convertUserIds.push(nextPost.user.id);
        const convertUpdateDto: ConvertUpdateDto = {
          _id: payload.convert.id,
          userIds: convertUserIds,
          activeUserId: nextPost.user.id,
        };
        await this.convertService.update(
          convertUpdateDto._id,
          convertUpdateDto,
        );
        this.ws.to(payload.convert.id).emit('convertEmit', payload.message); // НЕ ЯСНО НУЖНО ЛИ ДУБЛИРОВАТЬ СООБЩЕНИЕ С ЗАПРОСОМ

        const endTime = Date.now(); // Записываем конечное время
        const executionTime = endTime - startTime; // Рассчитываем время выполнения
        console.log(executionTime);
        return true;
      } else
        throw new ForbiddenException(
          'У вас нет прав для работы с этим конвертом!',
        );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof ForbiddenException) {
        throw err;
      }
      throw new InternalServerErrorException('Ошибка при одобрении конверта!');
    }
  }

  // @SubscribeMessage('chat')
  // async handleChatEvent(
  //     @MessageBody()
  //     payload: {
  //         convertId: string,
  //         senderId: string,
  //         message: MessageCreateDto
  //     }
  // ) {
  //     this.logger.info(payload)
  //     this.ws.to(payload.convertId).emit('chat', payload.message) // broadcast messages
  //     const convert = await this.convertService.findOneById(payload.convertId);
  //     const sender = await this.userService.findOne(payload.senderId)
  //     payload.message.convert = convert;
  //     payload.message.sender = sender;
  //     return await this.messageService.create(payload.message);
  // }

  @SubscribeMessage('join_room')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      convertId: string;
      userId: string;
    },
  ) {
    try {
      const compareId = async (payload: {
        convertId: string;
        userId: string;
      }): Promise<boolean> => {
        const convert = await this.convertService.findOneById(
          payload.convertId,
          ['convertToUsers.user'],
        );
        const convertToUsers = convert.convertToUsers;
        for (const convertToUser of convertToUsers) {
          if (convertToUser.user.id === payload.userId) {
            return true; // Если ID совпадает, возвращаем true
          }
        }

        return false; // Если не найдено совпадение, возвращаем false
      };
      // Важно! Ждем результат выполнения compareId с помощью await
      const isUserInConvert = await compareId(payload);
      if (isUserInConvert) {
        this.logger.info(`${payload.userId} is joining ${payload.convertId}`);
        const client = this.clients.get(payload.userId);
        if (client) {
          client.join(payload.convertId); // Теперь используем join, чтобы присоединить клиента к комнате
        }
        const sockets = await this.ws.in(payload.convertId).fetchSockets();
        for (const socket of sockets) {
          console.log(socket.id);
          console.log(socket.rooms);
        }
      } else {
        throw new ForbiddenException('У вас нет доступа к этому чату!');
      }
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof ForbiddenException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении чата');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client Disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  handleConnection(client: Socket) {
    // Извлечение параметров из URL
    const { userId } = client.handshake.query;
    this.logger.info(`Client Connected: ${userId}`);
    this.clients.set(userId as string, client);
    this.logger.info(`Number of connected clients: ${this.clients.size}`);
  }
}
