import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";
import { Post } from "src/domains/post.entity";
import { User } from "src/domains/user.entity";



export class OrganizationCreateDto {
    
    @ApiProperty({ description: 'Название организации' })
    @IsString()
    @IsNotEmpty()
    organizationName: string;
    
    @ApiProperty({ description: 'ID родительской организации' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    parentOrganizationId?: string;
    
    @Exclude({toPlainOnly: true})
    account?: Account;
}