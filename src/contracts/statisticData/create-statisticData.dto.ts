import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Statistic } from "src/domains/statistic.entity";

export class StatisticDataCreateDto{
    @ApiProperty({description: 'Значение', required: true, example: 3500})
    value: number;

    @Exclude({toPlainOnly: true})
    statistic: Statistic;
}

// add DATA