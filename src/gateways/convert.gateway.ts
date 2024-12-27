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
import { ConvertCreateDto } from 'src/contracts/convert/create-convert.dto';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { ConvertUpdateDto } from 'src/contracts/convert/update-convert.dto';
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { TypeConvert } from 'src/domains/convert.entity';
import { Logger } from 'winston';

@WebSocketGateway(5001, { namespace: 'chat', cors: process.env.NODE_ENV === 'dev' ? '*:*' : {origin: process.env.PROD_API_HOST} })
export class ConvertGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly convertService: ConvertService,
    private readonly postService: PostService,
    @Inject('winston') private readonly logger: Logger, // инъекция логгера
  ) { }
  private clients: Map<string, Socket> = new Map();
  @WebSocketServer() ws: Server;

  afterInit(server: Server) {
    this.logger.info(`WebSocket for chat initialized`);
  }


  @SubscribeMessage('approve')
  async handleApproval(
    @MessageBody()
    payload: {
      isApproved: boolean;
      activePostId: string;
      convertId: string;
      convertToPostIds: string[]
    },
  ) {
    try {
      const startTime = Date.now(); // Записываем начальное время
      this.logger.info(JSON.stringify(payload));
      const postOfSender = await this.postService.findOneById(payload.activePostId);
      const convert = await this.convertService.findOneById(payload.convertId)
      console.log(JSON.stringify(postOfSender));
      const indexOfActivePostId = convert.pathOfPosts.indexOf(convert.activePostId);
      if (postOfSender.id === convert.activePostId) {
        if (convert.convertType === TypeConvert.DIRECT) {
          if (payload.isApproved) {
            console.log(indexOfActivePostId);
            if(indexOfActivePostId === convert.pathOfPosts.length + 1){
              const convertUpdateDto: ConvertUpdateDto = {
                _id: convert.id,
                activePostId: convert.pathOfPosts[0],
              };
              await this.convertService.update(convertUpdateDto._id, convertUpdateDto);
              return { success: true, message: 'Одобрение выполнено успешно' };
            }
            const nextPost = await this.postService.findOneById(convert.pathOfPosts[indexOfActivePostId + 1]); // МОЖЕТ БЫТЬ NULL когда последний пост, соответственно аккуратно с nextPost.user.id
            const newConvertToPostIds = payload.convertToPostIds.concat(nextPost.id);
            const convertUpdateDto: ConvertUpdateDto = {
              _id: convert.id,
              convertToPostIds: newConvertToPostIds,
              activePostId: nextPost.id,
            };
            await this.convertService.update(convertUpdateDto._id, convertUpdateDto);

            const endTime = Date.now(); // Записываем конечное время
            const executionTime = endTime - startTime; // Рассчитываем время выполнения
            console.log(executionTime);
            return { success: true, message: 'Одобрение выполнено успешно' };
          }
        }
      } else {
        this.logger.error('У вас нет прав для работы с этим конвертом!');
        return { success: false, error: 'У вас нет прав для работы с этим конвертом!' };
      }
    } catch (err) {
      this.logger.error(err);
      return { success: false, error: 'Ошибка при одобрении конверта!' };
    }
  }

  // @SubscribeMessage('seen')
  // async handleSeenCoordination(
  //   @MessageBody()
  //   payload: {
  //     message: MessageCreateDto;
  //     sender: ReadUserDto;
  //     convert: ConvertReadDto;
  //   },
  // ) {
  //   try {
  //     const startTime = Date.now(); // Записываем начальное время
  //     this.logger.info(JSON.stringify(payload));
  //     const postOfSender = await this.postService.findOneById(
  //       payload.convert.activeUserId,
  //       ['user'],
  //     );
  //     console.log(JSON.stringify(postOfSender));
  //     if (postOfSender.user.id === payload.sender.id) {
  //       this.ws.to(payload.convert.id).emit('convertEmit', payload.message); // broadcast messages
  //       payload.message.convert = payload.convert;
  //       payload.message.sender = payload.sender;
  //       await this.messageService.create(payload.message);
  //       const indexOfActivePostId = payload.convert.pathOfPosts.indexOf(
  //         payload.convert.activeUserId,
  //       );
  //       const convertUserIds = payload.convert.convertToUsers.map(
  //         (convertToUser) => convertToUser.user.id,
  //       );
  //       const nextPost = await this.postService.findOneById(
  //         payload.convert.pathOfPosts[indexOfActivePostId + 1],
  //         ['user'],
  //       );
  //       convertUserIds.push(nextPost.user.id);
  //       const convertUpdateDto: ConvertUpdateDto = {
  //         _id: payload.convert.id,
  //         userIds: convertUserIds,
  //         activeUserId: nextPost.user.id,
  //       };
  //       await this.convertService.update(
  //         convertUpdateDto._id,
  //         convertUpdateDto,
  //       );
  //       this.ws.to(payload.convert.id).emit('convertEmit', payload.message); // НЕ ЯСНО НУЖНО ЛИ ДУБЛИРОВАТЬ СООБЩЕНИЕ С ЗАПРОСОМ

  //       const endTime = Date.now(); // Записываем конечное время
  //       const executionTime = endTime - startTime; // Рассчитываем время выполнения
  //       console.log(executionTime);
  //       return true;
  //     } else
  //       throw new ForbiddenException(
  //         'У вас нет прав для работы с этим конвертом!',
  //       );
  //   } catch (err) {
  //     this.logger.error(err);
  //     if (err instanceof ForbiddenException) {
  //       throw err;
  //     }
  //     throw new InternalServerErrorException('Ошибка при одобрении конверта!');
  //   }
  // }

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
      postId: string;
    },
  ) {
    try {
      const compareId = async (payload: {
        convertId: string;
        postId: string;
      }): Promise<boolean> => {
        const convert = await this.convertService.findOneById(
          payload.convertId,
          ['convertToPosts.post'],
        );
        const convertToPosts = convert.convertToPosts;
        for (const convertToPost of convertToPosts) {
          if (convertToPost.post.id === payload.postId) {
            return true; // Если ID совпадает, возвращаем true
          }
        }

        return false; // Если не найдено совпадение, возвращаем false
      };
      // Важно! Ждем результат выполнения compareId с помощью await
      const isPostInConvert = await compareId(payload);
      if (isPostInConvert) {
        this.logger.info(`${payload.postId} is joining ${payload.convertId}`);
        const client = this.clients.get(payload.postId);
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
    const { postId } = client.handshake.query;
    this.logger.info(`Client Connected: ${postId}`);
    this.clients.set(postId as string, client);
    this.logger.info(`Number of connected clients: ${this.clients.size}`);
  }
}
