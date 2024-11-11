import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ChatStorageService } from './chatStorage.service';
import { Logger } from 'winston';
@Injectable()
export class TelegramService {
  constructor(
    private readonly bot: Telegraf,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly chatStorageService: ChatStorageService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    if (!process.env.BOT_TOKEN)
      throw new Error('"BOT_TOKEN" env var is required!');
    this.bot = new Telegraf(process.env.BOT_TOKEN);
  }

  startBot() {
    // Telegraf will use `telegraf-session-local` configured above middleware

    this.bot.start(async (ctx) => {
      // Проверяем, начинается ли сообщение с /start
      if (ctx.message.text.startsWith('/start')) {
        const chatId = ctx.update.message?.chat.id || '';
        // Извлекаем параметр после /start
        const match = ctx.message.text.match(/^\/start ([\w-]+)$/);
        if (match) {
          // Удаляем /start из начала строки
          const command = match[1].replace('/start', '');
          const dashIndex = command.indexOf('-'); // Находим индекс первого дефиса
          // Разделяем строку на части по дефису
          const parts = [
            command.slice(0, dashIndex),
            command.slice(dashIndex + 1),
          ];
          const token = parts[0]; // Первая часть - токен
          const clientId = parts[1]; // Вторая часть - clientId
          if (token) {
            const telegramId = ctx.message.from.id;
            console.log(telegramId);
            const user =
              await this.usersService.findOneByTelegramId(telegramId);
            if (user !== null) {
              const authFlag = await this.authRequest(
                user.telephoneNumber,
                telegramId,
                token,
                clientId,
                ctx,
              );
              if (authFlag) {
                ctx.reply('Вход успешен!');
              }
              this.chatStorageService.clearChatById(chatId);
            } else {
              this.chatStorageService.setChatInfo(chatId, {
                token: token,
                clientId: clientId,
              });
              ctx.reply(
                'Добро пожаловать в бота, чтобы войти поделитесь контактом, нажав на кнопку ниже:',
                {
                  reply_markup: {
                    keyboard: [
                      [{ text: 'Поделиться контактом', request_contact: true }],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                  },
                },
              );
            }
          } else {
            ctx.reply(
              'Пожалуйста, используйте QR - код или ссылку из приложения!',
            );
          }
        } else {
          ctx.reply(
            'Команда /start не соответствует ожидаемому формату, пожалуйста, используйте QR - код или ссылку из приложения!',
          );
        }
      }
    });

    this.bot.on('contact', async (ctx) => {
      try {
        const chatId = ctx.update.message?.chat.id;
        const telephoneNumber = this.formatPhoneNumber(
          ctx.message.contact.phone_number,
        );
        const telegramId = Number(ctx.message.contact.user_id);
        const chat = this.chatStorageService.getChatInfo(chatId);
        if (chat.token) {
          const user = await this.usersService
            .findOneByTelephoneNumber(telephoneNumber)
            .catch((err) => {
              if (err instanceof NotFoundException) {
                return null;
              }
            });
          if (user !== null) {
            const authFlag = await this.authRequest(
              telephoneNumber,
              telegramId,
              chat.token,
              chat.clientId,
              ctx,
            );
            if (authFlag) {
              ctx.reply('Вход успешен!');
            }
            this.chatStorageService.clearChatById(chatId);
          } else {
            ctx.reply(
              'Похоже вы используете не тот номер, на который был зарегистрирован ваш аккаунт в академии. Пожалуйста, используйте номер, который был указан при регистрации.',
            );
          }
        } else {
          ctx.reply(
            'Пожалуйста, используйте QR - код или ссылку из приложения!',
          );
        }
        this.chatStorageService.clearChatById(chatId);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(
          'Ой, что - то пошло не так при входе через ТГ!',
        );
      }
    });

    this.bot.launch();
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Проверяем, начинается ли номер телефона с "+", если нет, добавляем
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }
    return phoneNumber;
  }

  async authRequest(
    phoneNumber: string,
    telegramId: number,
    token: string,
    clientId: string,
    ctx: any,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${process.env.API_HOST}${process.env.PORT}/auth/login/tg`,
          {
            telephoneNumber: phoneNumber,
            telegramId: telegramId,
            clientId: clientId,
            token: token,
          },
        ),
      );
      return true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.logger.error(error);
        ctx.reply('Попробуйте войти еще раз!');
      } else if (error.response && error.response.status === 404) {
        this.logger.error(error);
        ctx.reply('Ой, что - то пошло не так!');
      } else if (error.response && error.response.status === 500) {
        this.logger.error(error);
        ctx.reply('Ой, что - то пошло не так!');
      }
    }
  }
  // Другие методы для управления ботом...
}
