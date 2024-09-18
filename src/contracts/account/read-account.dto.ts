import { ApiProperty } from "@nestjs/swagger";
import { Organization } from "src/domains/organization.entity";
import { User } from "src/domains/user.entity";



export class AccountReadDto {
    
    @ApiProperty({ description: 'ID аккаунта' })
    id: string;
    
    @ApiProperty({ description: 'Имя аккаунта' })
    accountName: string;
    
    @ApiProperty({ description: 'Время создания' })
    createdAt: Date;
    
    @ApiProperty({ description: 'Время последнего обновления' })
    updatedAt: Date;
    
    @ApiProperty({ description: 'Список ID пользователей, принадлежащих аккаунту', isArray: true  })
    users?: User[];
    
    @ApiProperty({ description: 'Список ID организаций, принадлежащих аккаунту', isArray: true  })
    organizations?: Organization[];
}