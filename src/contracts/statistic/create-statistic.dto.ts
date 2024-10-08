import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { Post } from "src/domains/post.entity";
import { Type } from "src/domains/statistic.entity";
import { StatisticDataCreateDto } from "../statisticData/create-statisticData.dto";


export class StatisticCreateDto{
    
    @ApiProperty({description: 'Значение', required: true, example: 'Прямая', examples: ['Прямая', 'Обратная']})
    type: Type;
    
    @ApiProperty({description: 'Название статистики', required: true, example: 'Название'})
    name: string;
    
    @ApiProperty({description: 'Описание', required: true, example: 'Описание'})
    description?: string
    
    @ApiProperty({description: 'Id поста, к которому привязать статистику', required: true, example: '2420fabb-3e37-445f-87e6-652bfd5a050c'})
    postId: string

    @Exclude({toPlainOnly: true})
    post: Post;

    @Exclude({toPlainOnly: true})
    account: Account;

    
    @ApiProperty({description: 'Значения статистики', required: true, example: [
        {
            value: 4500
        },
        {
            value: 5000
        }
    ]})
    statisticDataCreateDtos: StatisticDataCreateDto[]
}