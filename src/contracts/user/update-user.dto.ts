import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {


    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    middleName?: string;

    @IsOptional()
    @IsInt()
    vk_id?: number | null

    @IsOptional()
    @IsInt()
    telegramId?: number | null

    @IsOptional()
    @IsString()
    avatar_url?: string | null

    @IsOptional()
    @IsString()
    telephoneNumber?: string | null;

}