import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AccountCreateDto {

    @ApiProperty({ description: 'Id аккаунта' })
    @IsUUID()
    @IsNotEmpty({message: 'Id аккаунта не может быть пустой'})
    id: string
    
    @ApiProperty({ description: 'Имя аккаунта' })
    @IsString()
    @IsNotEmpty({message: 'Название аккаунта не может быть пустым'})
    accountName: string;

    @ApiProperty({ description: 'Id из академии' })
    @IsUUID()
    @IsNotEmpty({message: 'tenantId аккаунта не может быть пустым'})
    tenantId: string
}