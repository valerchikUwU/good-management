import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { State } from "src/domains/strategy.entity";
import { User } from "src/domains/user.entity";

export class StrategyCreateDto{
    
    @ApiProperty({ description: 'Название стратегии' })
    strategyName: string;

    @ApiProperty({ description: 'Контент стратегии' })
    content: string;

    @ApiProperty({required: false, description: 'Состояние стратегии' })
    state?: State;

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description: 'IDs организаций, к которым привязать стратегию' })
    strategyToOrganizations: string[]
}