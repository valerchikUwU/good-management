import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Statistic } from "src/domains/statistic.entity";

export class StatisticDataCreateDto{
    @ApiProperty({description: 'Значение', required: true, example: 3500})
    @IsNumber()
    @IsNotEmpty({message: 'Значение не может быть пустым!'})
    value: number;

    @Exclude({toPlainOnly: true})
    statistic: Statistic;
}

// add DATA