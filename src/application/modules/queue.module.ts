import { Module } from '@nestjs/common';
import { ProducerService } from '../services/producer/producer.service';
import { ConsumerService } from '../services/consumer/consumer.service';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService],
})
export class QueueModule {}