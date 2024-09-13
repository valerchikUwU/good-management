import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Map<string, Socket> = new Map();
  private logger: Logger = new Logger('MessageGateway');
  @WebSocketServer() ws: Server;
  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }
  
  handleConnection(client: Socket) {
    this.logger.log(`Client Connected: ${client.id}`);
    this.clients.set(client.id, client);
    const { sockets } = this.ws.sockets;
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  @SubscribeMessage('getAuthData')
  async handleMessage(fingerprint: string, user_agent: string, token: string, clientId: string){
    return { clientId, fingerprint, user_agent, token };
  }

  async sendTokenToClient(clientId: string, userId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      const payload = {
        userId,
        clientId
      };
      client.emit('receiveClientId', payload);
      this.logger.log(`Sent token to client ${payload}`);
    } else {
      this.logger.warn(`Client ${clientId} not found`);
    }
  }


  async requestInfoFromClient(clientId: string, expectedData: string[]): Promise<Record<string, any>> {
    const client = this.clients.get(clientId);
    if (client) {
      return new Promise((resolve, reject) => {
        client.once('responseFromClient', (data) => {
          resolve(data);
        });
        client.emit('requestInfo', { expectedData, clientId });
      });
    } else {
      this.logger.warn(`Client ${clientId} not found`);
      return null;
    }
  }
  
}