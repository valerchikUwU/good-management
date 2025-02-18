import {
  Inject,
} from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/application/services/message/message.service';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { MessageReadDto } from 'src/contracts/message/read-message.dto';
import { MessageUpdateDto } from 'src/contracts/message/update-message.dto';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
import { Logger } from 'winston';

@WebSocketGateway({ namespace: 'convert', cors: process.env.NODE_ENV === 'dev' ? '*:*' : { origin: process.env.PROD_API_HOST } })
export class ConvertGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    @Inject('winston') private readonly logger: Logger, // инъекция логгера
  ) { }
  private clients: Map<string, Socket> = new Map();
  @WebSocketServer() ws: Server;

  afterInit(server: Server) {
    this.logger.info(`WebSocket for chat initialized`);
  }


  // @SubscribeMessage('approve')
  // async handleApproval(
  //   @MessageBody()
  //   payload: {
  //     isApproved: boolean;
  //     activePostId: string;
  //     convertId: string;
  //     convertToPostIds: string[]
  //   },
  // ) {
  //   try {
  //     const startTime = Date.now(); // Записываем начальное время
  //     this.logger.info(JSON.stringify(payload));
  //     const postOfSender = await this.postService.findOneById(payload.activePostId);
  //     const convert = await this.convertService.findOneById(payload.convertId)
  //     console.log(JSON.stringify(postOfSender));
  //     const indexOfActivePostId = convert.pathOfPosts.indexOf(convert.activePostId);
  //     if (postOfSender.id === convert.activePostId) {
  //       if (convert.convertType === TypeConvert.DIRECT) {
  //         if (payload.isApproved) {
  //           console.log(indexOfActivePostId);
  //           if(indexOfActivePostId === convert.pathOfPosts.length + 1){
  //             const convertUpdateDto: ConvertUpdateDto = {
  //               _id: convert.id,
  //               activePostId: convert.pathOfPosts[0],
  //             };
  //             await this.convertService.update(convertUpdateDto._id, convertUpdateDto);
  //             return { success: true, message: 'Одобрение выполнено успешно' };
  //           }
  //           const nextPost = await this.postService.findOneById(convert.pathOfPosts[indexOfActivePostId + 1]); // МОЖЕТ БЫТЬ NULL когда последний пост, соответственно аккуратно с nextPost.user.id
  //           const newConvertToPostIds = payload.convertToPostIds.concat(nextPost.id);
  //           const convertUpdateDto: ConvertUpdateDto = {
  //             _id: convert.id,
  //             convertToPostIds: newConvertToPostIds,
  //             activePostId: nextPost.id,
  //           };
  //           await this.convertService.update(convertUpdateDto._id, convertUpdateDto);

  //           const endTime = Date.now(); // Записываем конечное время
  //           const executionTime = endTime - startTime; // Рассчитываем время выполнения
  //           console.log(executionTime);
  //           return { success: true, message: 'Одобрение выполнено успешно' };
  //         }
  //       }
  //     } else {
  //       this.logger.error('У вас нет прав для работы с этим конвертом!');
  //       return { success: false, error: 'У вас нет прав для работы с этим конвертом!' };
  //     }
  //   } catch (err) {
  //     this.logger.error(err);
  //     return { success: false, error: 'Ошибка при одобрении конверта!' };
  //   }
  // }








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


  handleDisconnect(client: Socket) {
    // Извлечение параметров из URL
    this.logger.info(`Client Disconnected: ${client.id}`);
    this.clients.delete(client.id);
    this.clients.forEach((client) => {
      this.logger.info(`Client ID: ${client.id}, Socket ID: ${JSON.stringify(client.data)}`);
    });
  }

  handleConnection(client: Socket) {
    // Извлечение параметров из URL
    const { userId } = client.handshake.auth;
    client.data.userId = userId;
    this.logger.info(`Client Connected: ${client.id}`);
    this.clients.set(client.id, client);
    this.logger.info(`Number of connected clients: ${this.clients.size}`);
    this.clients.forEach((client) => {
      this.logger.info(`Client ID: ${client.id}, Socket ID: ${JSON.stringify(client.data)}`);
    });
    return { success: true }
  }

  @SubscribeMessage('join_convert')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      convertId: string;
    },
    connectedClient: Socket
  ) {
    const client = this.clients.get(connectedClient.id);
    if (!client) {
      return { success: false, message: 'Не удалось подключиться к чату!' };
    }
    client.join(payload.convertId); // Теперь используем join, чтобы присоединить клиента к комнате
    this.logger.info(`${connectedClient.id} is joining ${payload.convertId}`);
    const sockets = await this.ws.in(payload.convertId).fetchSockets();
    for (const socket of sockets) {
      console.log(socket.id);
      console.log(socket.rooms);
    }
    return { success: true };
  }

  @SubscribeMessage('messagesSeen')
  async handleMessagesSeenEvent(
    @MessageBody()
    payload: {
      convertId: string;
      messageIds: string[];
    },
  ) {
    const updateMessagesPromises = payload.messageIds.map((id) => {
      const messageUpdateDto: MessageUpdateDto = {
        _id: id,
        timeSeen: new Date(),
      };
      return this.messageService.update(id, messageUpdateDto); // Возвращаем промис напрямую
    });

    await Promise.all(updateMessagesPromises); // Дожидаемся всех обновлений

    this.ws.to(payload.convertId).emit('messagesAreSeen', new Date());

    return true;
  }


  handleMessageCreationEvent(convertId: string, message: MessageReadDto) {
    this.ws.to(convertId).emit('messageCreationEvent', message) // broadcast messages
    return true;
  }



  handleConvertExtensionEvent(convertId: string, host: PostReadDto, reciever: PostReadDto, pathOfPostsWithoutHostPost: string[]) {
    const socketsToNotify = this.findKeysByValue(this.clients, reciever.user.id);
    socketsToNotify.forEach(socket => {
      socket.join(convertId);
    });
    this.ws.to(convertId).emit('convertCreationEvent', {host: host, reciever: reciever, pathOfPostsWithoutHostPost: pathOfPostsWithoutHostPost});
    socketsToNotify.forEach(socket => {
      socket.leave(convertId);
    });
    return true;
  }

  findKeysByValue(map: Map<string, Socket>, userId: string): Socket[] {
    const matchingKeys: Socket[] = [];

    map.forEach((value, key) => {
      if (userId === value.data.userId) {
        const client = this.clients.get(key);
        matchingKeys.push(client);
      }
    });

    return matchingKeys;
  }
}


