import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Account } from "src/domains/account.entity";
import { State } from "src/domains/strategy.entity";
import { User } from "src/domains/user.entity";

export class StrategyCreateDto{

    @ApiProperty({ description: 'Контент стратегии', example: 'HTML текст' })
    @IsString()
    @IsNotEmpty({message: 'Содержание стратегии не может быть пустым!'})
    content: string;

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description: 'IDs организаций, к которым привязать стратегию', example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'] })
    @IsArray({message: 'Должно быть массивом'})
    @ArrayNotEmpty({message: 'Выберите хотя бы одну организацию!'})
    strategyToOrganizations: string[]
}