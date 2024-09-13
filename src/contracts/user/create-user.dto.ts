import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

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