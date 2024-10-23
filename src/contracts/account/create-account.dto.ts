import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class AccountCreateDto {

    @ApiProperty({ description: 'Id аккаунта' })
    @IsUUID()
    id: string
    
    @ApiProperty({ description: 'Имя аккаунта' })
    @IsString()
    accountName: string;

    @ApiProperty({ description: 'Id из академии' })
    @IsUUID()
    tenantId: string
}