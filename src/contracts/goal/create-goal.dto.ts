import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Account } from "src/domains/account.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { User } from "src/domains/user.entity";


export class GoalCreateDto {
    
    @ApiProperty({ description: 'Название цели', example: 'Название цели' })
    @IsString()
    @IsNotEmpty({message: 'Название цели не может быть пустым!'})
    goalName: string; // DELETED
    
    @ApiProperty({ description: 'Порядковый номер', example: 1 })
    @IsInt()
    @IsNotEmpty()
    orderNumber: number;
    
    @ApiProperty({ description: 'Текст цели', example: 'Контент цели' })
    @IsString()
    @IsNotEmpty({ message: 'Содержание не может быть пустым!' })
    content: string;

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description: 'IDs организаций, с которыми связать цель', example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'] })
    @IsArray({ message: 'Должен быть массив!' })
    @ArrayNotEmpty({ message: 'Выберите хотя бы одну организацию!' })
    goalToOrganizations: string[]
}