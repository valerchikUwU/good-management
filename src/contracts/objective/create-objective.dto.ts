import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveCreateDto{
    
    @ApiProperty({ description: 'Ситуация', isArray: true, example: ['Текст'] })
    @IsArray({message: 'Должен быть массив!'})
    @ArrayNotEmpty({message: 'Заполните хотя бы один блок для ситуации!'})
    situation: string[];

    @ApiProperty({ description: 'Контент краткосрочной цели', isArray: true, example: ['Контент'] })
    @IsArray({message: 'Должен быть массив!'})
    @ArrayNotEmpty({message: 'Заполните хотя бы один блок для содержания!'})
    content: string[];

    @ApiProperty({ description: 'Целевая причина', isArray: true, example: ['Причина'] })
    @IsArray({message: 'Должен быть массив!'})
    @ArrayNotEmpty({message: 'Заполните хотя бы один блок для коренной причины!'})
    rootCause: string[];

    @ApiProperty({ description: 'Id стратегии, с которой связать краткосрочную цель', example: '21dcf96d-1e6a-4c8c-bc12-c90589b40e93' })
    @IsUUID()
    @IsNotEmpty({message: 'ID стратегии не может быть пустым!'})
    strategyId: string;

    @Exclude({toPlainOnly: true})
    strategy: Strategy;

    @Exclude({toPlainOnly: true})
    account: Account;
}