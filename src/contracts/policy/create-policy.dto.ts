import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Account } from "src/domains/account.entity";
import { State, Type } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";


export class PolicyCreateDto{
    
    @ApiProperty({ description: 'Название политики' })
    policyName: string
    
    @ApiProperty({required: false, description: 'Состояние политики' })
    state?: State;
    
    @ApiProperty({ description: 'Тип политики' })
    type: Type;
    
    @ApiProperty({ description: 'HTML контент политики' })
    content: string;
    
    @Exclude({ toPlainOnly: true })
    user: User;

    @Exclude({ toPlainOnly: true })
    account: Account;
    
    @ApiProperty({ description: 'IDs организаций, к которым привязать политику' })
    policyToOrganizations: string[]
}