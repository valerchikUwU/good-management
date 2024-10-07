// app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { AppService } from './app.service'; // Импортируйте ваш сервис
import { TelegramService } from './application/services/telegram/telegram.service'; // Импортируйте TelegramService

describe('AppController', () => {
  let appController: AppController;
  let clientProxyMock: ClientProxy;
  let appServiceMock: AppService;
  let telegramServiceMock: TelegramService;

  beforeEach(async () => {
    clientProxyMock = {
      send: jest.fn().mockReturnValue(of('Message processed')),
    } as any;

    appServiceMock = {
      // Здесь можно замокать методы AppService, если они используются
    } as any;

    telegramServiceMock = {
      // Здесь можно замокать методы TelegramService, если они используются
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: clientProxyMock,
        },
        {
          provide: AppService,
          useValue: appServiceMock,
        },
        {
          provide: TelegramService,
          useValue: telegramServiceMock,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should send a message to RabbitMQ and return a token', () => {
    const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    const ip = '192.168.1.100';

    const result = appController.getToken(user_agent, ip);

    // Проверка, что метод send был вызван с правильными параметрами
    const message = { text: 'Hello, RabbitMQ!' };
    expect(clientProxyMock.send).toHaveBeenCalledWith({ cmd: 'message' }, message);

    // Проверка результата на наличие токена
    expect(result).toHaveProperty('token');
  });
});
