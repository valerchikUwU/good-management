import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Account } from "src/domains/account.entity";
import { State, Type } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";


export class PolicyCreateDto{
    
    @ApiProperty({ description: 'Название политики', example: 'Политика' })
    @IsString()
    @IsNotEmpty()
    policyName: string
    
    @ApiProperty({description: 'Состояние политики', required: false,  example: 'Черновик', examples: ['Черновик', 'Активный', 'Отменён'] })
    @IsOptional()
    @IsEnum(State)
    state?: State;
    
    @ApiProperty({ description: 'Тип политики', example: 'Директива', examples: ['Директива', 'Инструкция'] })
    @IsEnum(Type)
    type: Type;
    
    @ApiProperty({ description: 'HTML контент политики', example: 'HTML контент (любая строка пройдет)' })
    @IsString()
    @IsNotEmpty()
    content: string;
    
    @Exclude({ toPlainOnly: true })
    user: User;

    @Exclude({ toPlainOnly: true })
    account: Account;
    
    @ApiProperty({ description: 'IDs организаций, к которым привязать политику', example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'] })
    @IsArray()
    @ArrayNotEmpty()
    policyToOrganizations: string[]
}