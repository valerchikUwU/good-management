// import { Injectable } from "@nestjs/common";
// import { Telegraf } from 'telegraf'
// import LocalSession from 'telegraf-session-local';

// @Injectable()
// export class TelegramService {
//     private readonly bot: Telegraf;

//     constructor() {
//         if (!process.env.BOT_TOKEN)
//             throw new Error('"BOT_TOKEN" env var is required!');
//         this.bot = new Telegraf(process.env.BOT_TOKEN);
//     }

//     startBot(): void {
//         const localSession = new LocalSession({
//             // Database name/path, where sessions will be located (default: 'sessions.json')
//             database: "localSessionTelegram.json",
//             // Name of session property object in Telegraf Context (default: 'session')
//             property: "session",
//             // Type of lowdb storage (default: 'storageFileSync')
//             storage: LocalSession.storageFileAsync,
//             // Format of storage/database (default: JSON.stringify / JSON.parse)
//             format: {
//                 serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
//                 deserialize: (str) => JSON.parse(str),
//             },
//             // We will use `messages` array in our database to store user messages using exported lowdb instance from LocalSession via Telegraf Context
//             state: { messages: [] },
//         });
//         // Telegraf will use `telegraf-session-local` configured above middleware
//         this.bot.use(localSession.middleware());

//         this.bot.start(async (ctx) => {
//             // Проверяем, начинается ли сообщение с /start
//             if (ctx.message.text.startsWith("/start")) {
//                 // Извлекаем параметр после /start
//                 const match = ctx.message.text.match(/^\/start ([\w-]+)$/);
//                 console.log(match);
//                 if (match) {
//                     // Удаляем /start из начала строки
//                     const command = match[1].replace("/start", "");
//                     console.log(`start: ${command}`);
//                     // Разделяем строку на части по дефису
//                     const parts = command.split(/-(.*)/);
//                     const token = parts[0]; // Первая часть - токен
//                     const sessionId = parts[1]; // Вторая часть - sessionId
//                     console.log(`start: ${token}`);
//                     console.log(`start: ${sessionId}`);
//                     // Здесь можно использовать token и sessionId для дальнейших действий
//                     if (token) {
//                         // Теперь можно безопасно сохранять данные в сессию
//                         (ctx as any).session.token = 'your_token_here'; // Сохраняем токен в сессию
//                         (ctx as any).session.sessionId = 'your_session_id_here'; // Сохраняем sessionId в сессию
//                         const telegramId = ctx.message.from.id;
//                         console.log(telegramId)
//                         const account = await Account.findOne({
//                             where: { telegramId: telegramId },
//                         });
//                         if (account !== null) {
//                             await authRequest(
//                                 account.telephoneNumber,
//                                 telegramId,
//                                 token,
//                                 sessionId,
//                                 ctx
//                             );
//                         } else {
//                             ctx.reply(
//                                 "Добро пожаловать в бота Чтобы зарегистрироваться отправьте номер вашего телефона, нажав на кнопку ниже:",
//                                 {
//                                     reply_markup: {
//                                         keyboard: [
//                                             [{ text: "Поделиться контактом", request_contact: true }],
//                                         ],
//                                         resize_keyboard: true,
//                                         one_time_keyboard: true,
//                                     },
//                                 }
//                             );
//                         }
//                     } else {
//                         ctx.reply(
//                             "Пожалуйста, используйте QR - код или ссылку из приложения!"
//                         );
//                     }
//                 } else {
//                     console.log("Команда /start не соответствует ожидаемому формату");
//                 }
//             }
//         });

//         this.bot.on("contact", async (ctx) => {
//             // Логика обработки контакта
//         });

//         this.bot.launch();
//     }

//     // Другие методы для управления ботом...
// }