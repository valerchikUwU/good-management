import {
  BadRequestException,
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
  ConnectedSocket,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { ClientCredentialsDto } from 'src/contracts/websockets/clientCredentials.dto';
import { Logger } from 'winston';

@WebSocketGateway({ namespace: 'auth', cors: process.env.NODE_ENV === 'dev' ? '*:*' : { origin: process.env.PROD_API_HOST } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('winston') private readonly logger: Logger, // инъекция логгера
  ) { }
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
    this.logger.info(`Number of connected clients: ${this.clients.size}`);
  }


  sendTokenToClient(
    clientId: string,
    userId: string,
    accessToken: string,
    refreshTokenId: string,
  ) {
    try {
      const client = this.clients.get(clientId);
      if (client) {
        const payload = {
          userId,
          accessToken,
          refreshTokenId,
        };
        client.emit('receiveAuthInfo', payload);
        this.logger.info(`Sent token to client ${JSON.stringify(payload)}`);
      } else {
        throw new NotFoundException(
          `WebSocket соединение не установлено, не найден клиент с ID: ${clientId}`,
        );
      }
    }
    catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при входе!');
    }

  }

  async requestInfoFromClient(
    clientId: string,
    expectedData: string[],
    timeoutMs = 3000, // Тайм-аут в миллисекундах
  ): Promise<Record<string, any>> {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new NotFoundException(`WebSocket соединение не установлено, клиент с ID: ${clientId} не найден`);
    }
    const payload = { expectedData, clientId };
    client.emit('requestInfo', payload);
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout waiting for response from client: ${clientId}`));
      }, timeoutMs);

      client.once('responseFromClient', async (data) => {
        clearTimeout(timeout);
        const clientCredentialsDto = plainToInstance(ClientCredentialsDto, data);
        await validateOrReject(clientCredentialsDto).catch(errors => {
          reject(new BadRequestException(errors));
        });
        resolve(data); // Завершаем промис
      });
    });


  }


  @SubscribeMessage('responseFromClient')
  async handleResponse(
    @MessageBody() data: ClientCredentialsDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.info(`Response received from client ${client.id}: ${JSON.stringify(data)}`);
  }
}
