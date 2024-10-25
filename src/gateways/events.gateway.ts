import { Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';


@WebSocketGateway({namespace: 'auth', cors: '*:*' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('winston') private readonly logger: Logger, // инъекция логгера
  ) {}
  private clients: Map<string, Socket> = new Map();
  @WebSocketServer() ws: Server;

  afterInit(server: Server) {
    this.logger.info(`WebSocket for auth initialized`);
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client Disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }
  
  handleConnection(client: Socket) {
    this.logger.info(`Client Connected: ${client.id}`);
    this.clients.set(client.id, client);
    const { sockets } = this.ws.sockets;
    this.logger.info(`Number of connected clients: ${this.clients.size}`);
  }

  @SubscribeMessage('getAuthData')
  async handleMessage(fingerprint: string, user_agent: string, token: string, clientId: string){
    return { clientId, fingerprint, user_agent, token };
  }

  async sendTokenToClient(clientId: string, userId: string, accessToken: string, refreshTokenId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      const payload = {
        userId,
        accessToken,
        refreshTokenId
      };
      client.emit('receiveAuthInfo', payload);
      this.logger.info(`Sent token to client ${JSON.stringify(payload)}`);
    } else {
      this.logger.warn(`Client ${clientId} not found`);
    }
  }


  async requestInfoFromClient(clientId: string, expectedData: string[]): Promise<Record<string, any>> {
    try{
      const client = this.clients.get(clientId);
      if (client) {
        return new Promise((resolve, reject) => {
          client.once('responseFromClient', (data) => {
            resolve(data);
          });
          client.emit('requestInfo', { expectedData, clientId });
        });
      } else {
        throw new NotFoundException(`WebSocket соединение не установлено, не найден клиент с ID: ${clientId}`)
      }
    }
    catch(err){

      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
          throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении проекта');
    }
    
  }
  
}