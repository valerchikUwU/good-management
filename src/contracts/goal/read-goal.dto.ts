import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/domains/account.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { User } from "src/domains/user.entity";

export class GoalReadDto{
    
    @ApiProperty({ description: 'Id цели' })
    id: string;
    
    @ApiProperty({ description: 'Название цели' })
    goalName: string;
    
    @ApiProperty({ description: 'Порядковый номер' })
    orderNumber: number;
    
    @ApiProperty({ description: 'Текст цели' })
    content: string;
    
    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
    
    @ApiProperty({ description: 'Дата последнего обновления' })
    updatedAt: Date;
    
    @ApiProperty({ description: 'Id связанного юзера' })
    user?: User

    @ApiProperty({ description: 'Id связанного юзера' })
    account?: Account
    
    @ApiProperty({ description: 'Список ID организаций, принадлежащих цели', isArray: true  })
    goalToOrganizations: GoalToOrganization[]

}