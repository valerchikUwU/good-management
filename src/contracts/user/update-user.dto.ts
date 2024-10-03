import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {


    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsInt()
    @IsOptional()
    vk_id?: number | null

    @IsInt()
    @IsOptional()
    telegramId?: number | null

    @IsString()
    @IsOptional()
    avatar_url?: string | null

    @IsString()
    @IsOptional()
    telephoneNumber?: string | null;

}