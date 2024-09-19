import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { State } from "src/domains/strategy.entity";
import { User } from "src/domains/user.entity";

export class StrategyCreateDto{
    
    @ApiProperty({ description: 'Название стратегии', example: 'Стратегия' })
    strategyName: string;

    @ApiProperty({ description: 'Контент стратегии', example: 'HTML текст' })
    content: string;

    @ApiProperty({required: false, description: 'Состояние стратегии', example: 'Черновик', examples: ['Черновик', 'Активный', 'Завершено'] })
    state?: State;

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description: 'IDs организаций, к которым привязать стратегию', example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'] })
    strategyToOrganizations: string[]
}