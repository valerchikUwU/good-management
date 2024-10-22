import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Account } from "src/domains/account.entity";
import { ConvertToUser } from "src/domains/convertToUser.entity";
import { Message } from "src/domains/message.entity";
import { User } from "src/domains/user.entity";

export class ConvertCreateDto{
    
    @ApiProperty({ description: 'Тема чата', example: 'Тема' })
    @IsString()
    @IsNotEmpty({message: 'Тема не может быть пустой!'})
    convertTheme: string;

    @ApiProperty({ description: 'Длительность чата', example: 'хз как еще реализовать' })
    @IsString()
    @IsNotEmpty({message: 'Длительность чата не может быть пустой!'})
    expirationTime: string;
    
    @ApiProperty({ description: 'Длительность чата', example: '2024-09-26T13:03:19.759Z' })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty({message: 'Дата не может быть пустой!'})
    dateFinish: Date;

    @ApiProperty({ description: 'IDs участников чата', example: ['3b809c42-2824-46c1-9686-dd666403402a']})
    @IsArray({message: 'Должен быть массив'})
    @ArrayNotEmpty({message: 'Добавьте хотя бы одного участника чата!'})
    userIds: string[];

    @Exclude({toPlainOnly: true})
    convertToUsers: ConvertToUser[];
    
    @Exclude({toPlainOnly: true})
    host: User;
    
    @Exclude({toPlainOnly: true})
    account: Account;
}