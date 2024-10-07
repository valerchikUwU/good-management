import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GoalUpdateDto{
    
    @ApiProperty({ description: 'Id цели', example: '907b0875-d29d-4f84-89fe-6b037d1ecc7f'})
    @IsNotEmpty()
    @IsUUID()
    _id: string;
    
    @ApiProperty({ description: 'Название цели', required: false, example: 'Новое название' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    goalName?: string;
    
    @ApiProperty({ description: 'Порядковый номер', required: false, example: 1})
    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    orderNumber?: number;
    
    @ApiProperty({ description: 'Текст цели', required: false, example: 'Новый контент'})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;
    
    @ApiProperty({ description: 'Список ID организаций, принадлежащих цели', required: false, isArray: true, example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f', '1f1cca9a-2633-489c-8f16-cddd411ff2d0']  })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    goalToOrganizations?: string[]

}