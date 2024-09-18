import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/domains/account.entity";
import { Post } from "src/domains/post.entity";
import { User } from "src/domains/user.entity";



export class OrganizationCreateDto {
    
    @ApiProperty({ description: 'Название организации' })
    organizationName: string;
    
    @ApiProperty({ description: 'ID родительской организации' })
    parentOrganizationId: string | null
    
    @ApiProperty({ description: 'ID связанного аккаунта' })
    account?: Account;
}