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
  vk_id: number

  @IsInt()
  @IsOptional()
  telegramId: number

  @IsString()
  @IsOptional()
  avatar_url: string

  @IsString()
  @IsOptional()
  telephoneNumber: string;

}