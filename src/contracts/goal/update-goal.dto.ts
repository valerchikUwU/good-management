import { ApiProperty } from "@nestjs/swagger";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";

export class GoalUpdateDto{
    
    @ApiProperty({ description: 'Id цели' })
    _id: string;
    
    @ApiProperty({ description: 'Название цели' })
    goalName?: string;
    
    @ApiProperty({ description: 'Порядковый номер' })
    orderNumber?: number;
    
    @ApiProperty({ description: 'Текст цели' })
    content?: string;
    
    @ApiProperty({ description: 'Список ID организаций, принадлежащих цели', isArray: true  })
    goalToOrganizations?: string[]

}