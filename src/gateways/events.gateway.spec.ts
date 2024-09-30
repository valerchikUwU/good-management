import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';
import { Logger } from 'winston';

// Mock Logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('EventsGateway', () => {
  let app: INestApplication;
  let gateway: EventsGateway;
  let server: Server;
  let clientSocket: Socket; // Обновленный импорт типа Socket

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        { provide: 'winston', useValue: mockLogger },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    gateway = module.get<EventsGateway>(EventsGateway);
    server = gateway.ws;

    // Подключение тестового WebSocket клиента
    clientSocket = io(`http://localhost:4444`, {
      reconnectionDelay: 0,
      forceNew: true,
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      console.log('Test client connected');
    });
  });

  afterEach(async () => {
    // Закрытие клиента и приложения после каждого теста
    clientSocket.close();
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should connect and disconnect client', (done) => {
    // Проверка подключения и отключения клиента
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      clientSocket.close();
    });

    clientSocket.on('disconnect', () => {
      expect(clientSocket.connected).toBe(false);
      done();
    });
  });

  it('should handle incoming messages', (done) => {
    // Тестирование обработчика сообщений на сервере
    const testMessage = {
      fingerprint: 'test-fingerprint',
      user_agent: 'test-user-agent',
      token: 'test-token',
      clientId: 'test-client-id',
    };

    clientSocket.emit('getAuthData', testMessage.fingerprint, testMessage.user_agent, testMessage.token, testMessage.clientId);

    // Проверка правильности полученных данных
    clientSocket.on('getAuthData', (response) => {
      expect(response).toEqual(testMessage);
      done();
    });
  });

  it('should send token to client', async () => {
    // Проверка отправки токена клиенту
    const clientId = clientSocket.id;
    await gateway.sendTokenToClient(clientId, 'test-user-id', 'test-access', 'test-refresh');

    clientSocket.on('receiveClientId', (data) => {
      expect(data).toEqual({ userId: 'test-user-id', clientId });
    });
  });

  it('should request and receive info from client', async () => {
    // Тестирование получения данных от клиента
    const clientId = clientSocket.id;
    const expectedData = ['fingerprint', 'userAgent', 'ip', 'token'];
    const mockResponse = { fingerprint: 'test-fingerprint', userAgent: 'test-user-agent',  token: 'test-token', clientId: 'clientId'};

    // Установка обработчика для получения запроса от сервера
    clientSocket.on('requestInfo', (data) => {
      expect(data).toEqual({ expectedData, clientId });
      // Отправка ответа на сервер
      clientSocket.emit('responseFromClient', mockResponse);
    });

    // Запрос данных от клиента и проверка корректности полученного ответа
    const response = await gateway.requestInfoFromClient(clientId, expectedData);
    expect(response).toEqual(mockResponse);
  });
});
