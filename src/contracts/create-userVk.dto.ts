import { IsUUID, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserVkDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsInt()
    vk_id: number

    @IsInt()
    telegramId: number

    @IsString()
    avatar_url: string

    @IsString()
    telephoneNumber: string;

}