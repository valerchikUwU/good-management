import { IsNumber, IsString } from "class-validator";

export class UpdateVkAuthUserDto {
    @IsNumber()
    vk_id: number;
    @IsString()
    avatar_url: string;
    @IsString()
    telephoneNumber: string;
}