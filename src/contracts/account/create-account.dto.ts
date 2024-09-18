import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AccountCreateDto {
    
    @ApiProperty({ description: 'Имя аккаунта' })
    @IsString()
    accountName: string;
}