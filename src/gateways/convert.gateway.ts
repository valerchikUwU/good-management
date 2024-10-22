import { Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { Message } from 'src/domains/message.entity';
import { User } from 'src/domains/user.entity';
import { Logger } from 'winston';


@WebSocketGateway(80, {namespace: 'chat', cors: '*:*' })
export class ConvertGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('winston') private readonly logger: Logger, // инъекция логгера
  ) {}
  private clients: Map<string, Socket> = new Map();
  @WebSocketServer() ws: Server;

  afterInit(server: Server) {
    this.logger.info(`WebSocket for chat initialized`);
  }


  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: Message
  ): Promise<Message> {
    this.logger.info(payload)
    this.ws.to(payload.id).emit('chat', payload) // broadcast messages
    return payload
  }

  @SubscribeMessage('join_room')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      convertId: string
      user: User
    }
  ) {
    if (payload.user.id) {
      this.logger.info(`${payload.user.id} is joining ${payload.convertId}`)
      this.ws.in(payload.user.id).socketsJoin(payload.convertId)
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client Disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }
  
  handleConnection(client: Socket) {
    this.logger.info(`Client Connected: ${client.id}`);
    this.clients.set(client.id, client);
    const { sockets } = this.ws.sockets;
    this.logger.info(`Number of connected clients: ${sockets.size}`);
  }

  
}