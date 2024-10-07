// app.service.ts
import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @MessagePattern({ cmd: 'message' })
  handleMessage(data: any) {
    console.log('Message received:', data);
    return 'Message processed';
  }
}