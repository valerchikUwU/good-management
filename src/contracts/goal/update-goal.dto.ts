import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GoalUpdateDto{
    
    @ApiProperty({ description: 'Id цели' })
    @IsUUID()
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