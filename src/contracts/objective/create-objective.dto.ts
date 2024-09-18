import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveCreateDto{
    
    @ApiProperty({ description: 'Порядковый номер краткосрочной цели'})
    orderNumber: number;
    
    @ApiProperty({ description: 'Ситуация' })
    situation: string;

    @ApiProperty({ description: 'Контент краткосрочной цели' })
    content: string

    @ApiProperty({ description: 'Целевая причина' })
    rootCause: string;

    @Exclude({toPlainOnly: true})
    strategy: Strategy

    @Exclude({toPlainOnly: true})
    account: Account
}