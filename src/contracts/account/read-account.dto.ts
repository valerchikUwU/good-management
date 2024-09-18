import { ApiProperty } from "@nestjs/swagger";
import { Organization } from "src/domains/organization.entity";
import { User } from "src/domains/user.entity";



export class AccountReadDto {

    @ApiProperty({ description: 'ID аккаунта', example: 'a1118813-8985-465b-848e-9a78b1627f11' })
    id: string;

    @ApiProperty({ description: 'Имя аккаунта', example: 'OOO PIPKA' })
    accountName: string;

    @ApiProperty({ description: 'Время создания', example: '2024-09-16 15:53:29.593552' })
    createdAt: Date;

    @ApiProperty({ description: 'Время последнего обновления', example: '2024-09-16 15:53:29.593552' })
    updatedAt: Date;

    @ApiProperty({ description: 'Список ID пользователей, принадлежащих аккаунту', isArray: true })
    users?: User[];

    @ApiProperty({ description: 'Список ID организаций, принадлежащих аккаунту', isArray: true })
    organizations?: Organization[];
}