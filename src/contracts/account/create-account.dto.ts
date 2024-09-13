import { IsString } from "class-validator";

export class AccountCreateDto {
    
    @IsString()
    accountName: string;
}