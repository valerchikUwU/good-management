import {
  Headers, Body, Controller, Get, Ip,
  OnModuleInit,
  HttpStatus
} from '@nestjs/common';
import { AppService } from './app.service';
import * as crypto from 'crypto';
import { TelegramService } from './application/services/telegram/telegram.service';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Homepage')
@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService,
    private readonly telegramBotService: TelegramService
  ) { }

  @Get()
  @ApiOperation({summary: 'Домашняя страница'})
  @ApiResponse({ status: HttpStatus.OK, description: "ОК!"})
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!",
    example: {
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ip: "192.168.1.100",
      token: "dd31cc25926db1b45f2e"
    }}) 
  @ApiHeader({
    name: 'User-Agent',
    required: true,
    description: 'Информация о браузере клиента',
  })
  getToken(@Headers('User-Agent') user_agent: string, @Ip() ip: string): object {
    const token = crypto.randomBytes(10).toString('hex');
    return { user_agent, ip, token };
  }


  onModuleInit() {
    this.telegramBotService.startBot();
  }
}
