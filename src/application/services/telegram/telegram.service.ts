import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Telegraf } from 'telegraf'
import LocalSession from 'telegraf-session-local';
import { UsersService } from "../users/users.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { ChatStorageService } from './chatStorage.service';
import { CreateUserDto } from "src/contracts/user/create-user.dto";
@Injectable()
export class TelegramService {

    constructor(
        private readonly bot: Telegraf,
        private readonly httpService: HttpService,
        private readonly usersService: UsersService,
        private readonly chatStorageService: ChatStorageService
    ) {
        if (!process.env.BOT_TOKEN)
            throw new Error('"BOT_TOKEN" env var is required!');
        this.bot = new Telegraf(process.env.BOT_TOKEN);
    }

    startBot() {
        // Telegraf will use `telegraf-session-local` configured above middleware

        this.bot.start(async (ctx) => {
            // Проверяем, начинается ли сообщение с /start
            if (ctx.message.text.startsWith("/start")) {

                const chatId = ctx.update.message?.chat.id || '';
                // Извлекаем параметр после /start
                const match = ctx.message.text.match(/^\/start ([\w-]+)$/);
                if (match) {
                    // Удаляем /start из начала строки
                    const command = match[1].replace("/start", "");
                    const dashIndex = command.indexOf('-');  // Находим индекс первого дефиса
                    // Разделяем строку на части по дефису
                    const parts = [command.slice(0, dashIndex), command.slice(dashIndex + 1)];
                    const token = parts[0]; // Первая часть - токен
                    const clientId = parts[1]; // Вторая часть - clientId
                    if (token) {
                        // Теперь можно безопасно сохранять данные в сессию
                        this.chatStorageService.setChatInfo(chatId, { token: token, clientId: clientId })
                        const telegramId = ctx.message.from.id;
                        const user = await this.usersService.findOneByTelegramId(telegramId).catch((err) => {
                            if (err instanceof NotFoundException) {
                                return null;
                            }
                        })
                        if (user !== null) {
                            const authFlag = await this.authRequest(user.telephoneNumber, user.telegramId, token, clientId, ctx, false);
                            this.chatStorageService.clearChatById(chatId);
                            if (authFlag) {
                                ctx.reply('Вход успешен!')
                            }
                        } else {
                            ctx.reply(
                                "Добро пожаловать в бота Чтобы зарегистрироваться отправьте номер вашего телефона, нажав на кнопку ниже:",
                                {
                                    reply_markup: {
                                        keyboard: [
                                            [{ text: "Поделиться контактом", request_contact: true }],
                                        ],
                                        resize_keyboard: true,
                                        one_time_keyboard: true,
                                    },
                                }
                            );
                        }
                    } else {
                        ctx.reply(
                            "Пожалуйста, используйте QR - код или ссылку из приложения!"
                        );
                    }
                } else {
                    console.log("Команда /start не соответствует ожидаемому формату");
                }
            }
        });

        this.bot.on("contact", async (ctx) => {
            try {
                const chatId = ctx.update.message?.chat.id;
                const telephoneNumber = this.formatPhoneNumber(ctx.message.contact.phone_number);
                const firstName = ctx.message.contact.first_name;
                const lastName = ctx.message.contact.last_name;
                const telegramId = Number(ctx.message.contact.user_id);
                const chat = this.chatStorageService.getChatInfo(chatId)
                if (chat.token) {
                    await this.authRequest(telephoneNumber, telegramId, chat.token, chat.clientId, ctx, true, firstName, lastName)
                } else {
                    ctx.reply("Пожалуйста, используйте QR - код или ссылку из приложения!");
                }
                this.chatStorageService.clearChatById(chatId);
            }
            catch (err) {
                console.log(err)

            }

        });

        this.bot.launch();
    }

    formatPhoneNumber(phoneNumber: string): string {
        // Проверяем, начинается ли номер телефона с "+", если нет, добавляем
        if (!phoneNumber.startsWith("+")) {
            phoneNumber = "+" + phoneNumber;
        }
        return phoneNumber;
    }

    async authRequest(phoneNumber: string, telegramId: number, token: string, clientId: string, ctx: any, createUserFlag: boolean, firstName?: string, lastName?: string): Promise<any> {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${process.env.API_HOST}${process.env.PORT}/auth/login/tg`, {
                    telephoneNumber: phoneNumber,
                    telegramId: telegramId,
                    clientId: clientId,
                    token: token,
                    createUserFlag: createUserFlag,
                    firstName: firstName === undefined ? null : firstName,
                    lastName: lastName === undefined ? null : lastName,
                })
            )
            return true;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                ctx.reply('Попробуйте войти еще раз!')
            } else if (error.response && error.response.status === 404) {
                ctx.reply('Ой, что - то пошло не так!')
            } else if (error.response && error.response.status === 500) {
                ctx.reply('Ой, что - то пошло не так!')
            }
        }
    }
    // Другие методы для управления ботом...
}
