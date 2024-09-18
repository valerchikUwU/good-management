import { Injectable } from "@nestjs/common";
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
                console.log(match);
                if (match) {
                    // Удаляем /start из начала строки
                    const command = match[1].replace("/start", "");
                    console.log(`start: ${command}`);
                    // Разделяем строку на части по дефису
                    const parts = command.split(/-(.*)/);
                    const token = parts[0]; // Первая часть - токен
                    const clientId = parts[1]; // Вторая часть - clientId
                    console.log(`start: ${token}`);
                    console.log(`start: client ${clientId}`);
                    if (token) {
                        // Теперь можно безопасно сохранять данные в сессию
                        this.chatStorageService.setChatInfo(chatId, { token: token, clientId: clientId })

                        const chat = this.chatStorageService.getChatInfo(chatId)
                        console.log(`CHAT CHAT CHAT ${chat.token}`)
                        console.log(chat.clientId)
                        const telegramId = ctx.message.from.id;
                        console.log(telegramId)
                        const user = await this.usersService.findOneByTelegramId(telegramId)
                        console.log(`START USER:${JSON.stringify(user)}`)
                        if (user !== null) {
                            await this.authRequest(user.telephoneNumber, user.telegramId, token, clientId, ctx);
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
                console.log(firstName);
                console.log(lastName);
                console.log(`CHAT CHAT CHAT ${chat.token}`)
                console.log(chat.clientId)
                console.log(telephoneNumber)
                if (chat.token) {
                    const createUserDto: CreateUserDto = {
                        firstName: firstName,
                        lastName: lastName,
                        telegramId: telegramId,
                        telephoneNumber: telephoneNumber
                    }
                    await this.usersService.create(createUserDto);
                    await this.authRequest(telephoneNumber, telegramId, chat.token, chat.clientId, ctx)
                } else {
                    ctx.reply("Пожалуйста, используйте QR - код или ссылку из приложения!");
                }

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

    async authRequest(phoneNumber: string, telegramId: number, token: string, clientId: string, ctx: any): Promise<any> {
        console.log(`post post post ${clientId}`);

        console.log(`post post post ${token}`);
        const response = await lastValueFrom(
            this.httpService.post(`http://localhost:5000/auth/login/tg`, {
                telephoneNumber: phoneNumber,
                telegramId: telegramId,
                clientId: clientId,
                token: token,
            })
        ).then((response) => {
             if (response.status === 500 || response.status === 401) {
                ctx.reply("Что-то пошло не так!");
            } else {
                ctx.reply("Вход успешен!");
            }
        });


    }
    // Другие методы для управления ботом...
}
