import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveCreateDto{
    
    @ApiProperty({ description: 'Порядковый номер краткосрочной цели', example: 1})
    orderNumber: number;
    
    @ApiProperty({ description: 'Ситуация', example: 'Текст' })
    situation: string;

    @ApiProperty({ description: 'Контент краткосрочной цели', example: 'Контент' })
    content: string;

    @ApiProperty({ description: 'Целевая причина', example: 'Причина' })
    rootCause: string;

    @ApiProperty({ description: 'Id стратегии, с которой связать краткосрочную цель', example: 'a4448813-8985-465b-848e-9a78b1627f11' })
    strategyId: string;

    @Exclude({toPlainOnly: true})
    strategy: Strategy;

    @Exclude({toPlainOnly: true})
    account: Account;
}