import { RmqOptions, Transport } from '@nestjs/microservices';

export const rabbitmqConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'], // URL RabbitMQ-сервера
    queue: 'accounts_queue', // Название очереди
    queueOptions: {
      durable: false,
    },
  },
});
