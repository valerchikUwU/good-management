import { ForbiddenException, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { MessageService } from 'src/application/services/message/message.service';
import { UsersService } from 'src/application/services/users/users.service';
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { User } from 'src/domains/user.entity';
import { Logger } from 'winston';


@WebSocketGateway({ namespace: 'chat', cors: '*:*' })
export class ConvertGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly messageService: MessageService,
        private readonly userService: UsersService,
        private readonly convertService: ConvertService,
        @Inject('winston') private readonly logger: Logger, // инъекция логгера
    ) { }
    private clients: Map<string, Socket> = new Map();
    @WebSocketServer() ws: Server;

    afterInit(server: Server) {
        this.logger.info(`WebSocket for chat initialized`);
    }


    @SubscribeMessage('chat')
    async handleChatEvent(
        @MessageBody()
        payload: {
            convertId: string,
            senderId: string,
            message: MessageCreateDto
        }
    ) {
        this.logger.info(payload)
        this.ws.to(payload.convertId).emit('chat', payload.message) // broadcast messages
        const convert = await this.convertService.findOneById(payload.convertId);
        const sender = await this.userService.findOne(payload.senderId)
        payload.message.convert = convert;
        payload.message.sender = sender;
        return await this.messageService.create(payload.message);
    }

    @SubscribeMessage('join_room')
    async handleSetClientDataEvent(
        @MessageBody()
        payload: {
            convertId: string
            userId: string
        }
    ) {
        try {

            const compareId = async (payload: { convertId: string, userId: string }): Promise<boolean> => {
                const convert = await this.convertService.findOneById(payload.convertId);
                const convertToUsers = convert.convertToUsers;
                for (const convertToUser of convertToUsers) {
                    if (convertToUser.user.id === payload.userId) {
                        return true; // Если ID совпадает, возвращаем true
                    }
                }

                return false; // Если не найдено совпадение, возвращаем false
            }
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
            }
            else {
                throw new ForbiddenException('У вас нет доступа к этому чату!')
            }
        }
        catch (err) {

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