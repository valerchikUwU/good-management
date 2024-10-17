import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { Post } from "src/domains/post.entity";
import { Type } from "src/domains/statistic.entity";
import { StatisticDataCreateDto } from "../statisticData/create-statisticData.dto";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { StatisticDataUpdateDto } from "../statisticData/update-statisticData.dto";


export class StatisticUpdateDto{

    @ApiProperty({description: 'Id обновляемой статистики', required: true, example: '099f554d-3539-4c7c-b4ae-dc7bea092f22'})
    @IsUUID()
    @IsNotEmpty({message: 'ID статистики не может быть пустым!'})
    _id: string;
    
    @ApiProperty({description: 'Значение', required: true, example: 'Прямая', examples: ['Прямая', 'Обратная']})
    @IsOptional()
    @IsEnum(Type)
    type?: Type;
    
    @ApiProperty({description: 'Название статистики', required: true, example: 'Название'})
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'У статистики должно быть название!'})
    name?: string;
    
    @ApiProperty({description: 'Описание', required: false, example: 'Описание'})
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Описание статистики не может быть пустым!'})
    description?: string
    
    @ApiProperty({description: 'Id поста, к которому привязать статистику', required: true, example: '2420fabb-3e37-445f-87e6-652bfd5a050c'})
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({message: 'ID поста не может быть пустым!'})
    postId?: string

    @Exclude({toPlainOnly: true})
    post: Post;

    @ApiProperty({description: 'Значения статистики', required: true, example: [
        {
            value: 4500,
            valueDate: '2024-09-26 15:54:37.211744'
        },
        {
            value: 5000,
            valueDate: '2024-09-26 15:54:37.211744'
        }
    ]})
    @IsOptional()
    @IsArray({message: 'Должно быть массивом!'})
    @ArrayNotEmpty({message: 'Добавьте хотя бы одно значение для статистики!'})
    statisticDataCreateDtos?: StatisticDataCreateDto[]
    
    @ApiProperty({description: 'Значения статистики', required: true, example: [
        {
            _id: '1111fabb-3e37-445f-87e6-652bfd5a050c',
            value: 4500
        },
        {
            _id: '2222fabb-3e37-445f-87e6-652bfd5a050c',
            value: 5000
        }
    ]})
    @IsOptional()
    @IsArray({message: 'Должно быть массивом!'})
    @ArrayNotEmpty({message: 'Добавьте хотя бы одно значение для статистики!'})
    statisticDataUpdateDtos: StatisticDataUpdateDto[]
}