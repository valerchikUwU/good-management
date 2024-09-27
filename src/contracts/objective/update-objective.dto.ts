import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsUUID } from "class-validator";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveUpdateDto{

    @ApiProperty({ description: 'Id обновляемой краткосрочной цели', required: true, example: '1c509c6d-aba9-41c1-8b04-dd196d0af0c7' })
    @IsUUID()
    _id: string;

    @ApiProperty({ description: 'Порядковый номер', required: true, example: '0ba305e6-1d80-4ff6-a436-93d118f99993' })
    orderNumber?: number;

    @ApiProperty({ description: 'Ситуация', required: true, example: 'Ситуация' })
    situation?: string;

    @ApiProperty({ description: 'Контент', required: true, example: 'Контент' })
    content?: string

    @ApiProperty({ description: 'Коренная причина', required: true, example: 'Коренная причина' })
    rootCause?: string;

    @ApiProperty({ description: 'Id стратегии', required: true, example: '21dcf96d-1e6a-4c8c-bc12-c90589b40e93' })
    strategyId?: string

    @Exclude({toPlainOnly: true})
    strategy: Strategy
}