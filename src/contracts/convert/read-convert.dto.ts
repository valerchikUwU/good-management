import { Account } from "src/domains/account.entity";
import { ConvertToUser } from "src/domains/convertToUser.entity";
import { Message } from "src/domains/message.entity";
import { User } from "src/domains/user.entity";

export class ConvertReadDto{
    id: string;
    convertTheme: string;
    expirationTime: string;
    dateFinish: Date
    createdAt: Date;
    messages: Message[];
    convertToUsers: ConvertToUser[]
    host: User;
    account: Account;
}