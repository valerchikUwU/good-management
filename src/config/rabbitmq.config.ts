import { RmqOptions, Transport } from '@nestjs/microservices';
let url: string;
if (process.env.NODE_ENV === 'prod'){
  url = `amqp://${process.env.RABBITMQ_HOST_PROD}`
}
else{
  url = `amqp://${process.env.RABBITMQ_HOST_LOCAL}`
}

export const rabbitmqConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [url], // URL RabbitMQ-сервера
    queue: 'accounts_queue', // Название очереди
    queueOptions: {
      durable: false,
    },
  },
});
