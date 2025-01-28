import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Message } from 'src/domains/message.entity';
import { Target } from 'src/domains/target.entity';

export class AttachmentCreateDto {
    @ApiProperty({
        description: 'Название вложения',
        required: true,
        example: 'Галя_nudes.jpg',
    })
    attachmentName: string;

    @ApiProperty({
        description: 'Путь к вложению',
        required: true,
        example: 'uploads/1737988764326-photo_2022-03-13_23-16-33.jpg',
    })
    attachmentPath: string;

    @ApiProperty({
        description: 'Размер вложения',
        required: true,
        example: 345561,
    })
    attachmentSize: number;

    @ApiProperty({
        description: 'Расширение вложения',
        required: true,
        example: 'image/jpeg',
    })
    attachmentMimetype: string;

    @ApiProperty({
        description: 'Хеш файла',
        required: true,
        example: '2sad2828dfs99sdg99s9df9s9d9dhh888',
    })
    hash: string;

    @ApiProperty({
        description: 'Id задачи',
        required: false,
    })
    @IsOptional()
    targetId?: string;

    @ApiProperty({
        description: 'Id сообщения',
        required: false,
    })
    @IsOptional()
    messageId?: string;

    @Exclude({ toPlainOnly: true })
    target: Target;

    @Exclude({ toPlainOnly: true })
    message: Message;
}
