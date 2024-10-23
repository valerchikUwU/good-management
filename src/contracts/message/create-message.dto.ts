import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Convert } from "src/domains/convert.entity";
import { User } from "src/domains/user.entity";



export class MessageCreateDto{

    @ApiProperty({ description: 'Текст сообщения', required: true, example: 'Прывит' })
    @IsString()
    content: string;

    @Exclude({toPlainOnly: true})
    convert: Convert;

    @Exclude({toPlainOnly: true})
    sender: User;
}