import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);

  constructor() {
    // Подключение к RabbitMQ с правильными учетными данными
    const connection = amqp.connect([{
      hostname: 'goodmanagement.ru',
      username: 'nest-backend',
      password: 'pV<U47X1ES7?',
      vhost: '/'
    }]);

    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      // Настройка очереди и потребление сообщений
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('gm-to-nest-events', { durable: true });
        await channel.consume('gm-to-nest-events', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log(`Received message: ${JSON.stringify(content)}`);

            // Пример обработки события TenantCreatedEvent
            if (content.eventType === 'TENANT_CREATED') {
              this.handleTenantCreatedEvent(content);
            }

            // Подтверждение сообщения
            channel.ack(message);
          }
        });
      });

      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  // Обработка события TenantCreatedEvent
  private handleTenantCreatedEvent(event: any) {
    const payload = event.payload;
    this.logger.log(`Handling TenantCreatedEvent: ${JSON.stringify(payload)}`);
    // Здесь можно реализовать сохранение данных или другую логику
  }
}



