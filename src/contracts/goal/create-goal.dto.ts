import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { User } from "src/domains/user.entity";


export class GoalCreateDto {
    
    @ApiProperty({ description: 'Название цели' })
    goalName: string;
    
    @ApiProperty({ description: 'Порядковый номер' })
    orderNumber: number;
    
    @ApiProperty({ description: 'Текст цели' })
    content: string;

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description: 'IDs организаций, с которыми связать цель' })
    goalToOrganizations: string[]
}