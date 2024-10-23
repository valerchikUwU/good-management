import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";



export class OrganizationCreateDto {

    @ApiProperty({ description: 'ID родительской организации' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string;
    
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