import { Account } from "src/domains/account.entity";
import { Type } from "src/domains/project.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";
import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";
import { TargetCreateDto } from "../target/create-target.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ProjectCreateDto {

    @ApiProperty({ description: 'Id программы', required: false, example: 'b6ed2664-9510-4a47-9117-6ce89903b4b5' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({message: 'ID программы не может быть пустым!'})
    programId?: string | null;

    @ApiProperty({ description: 'Содержание проекта', required: false, example: 'Контент проекта' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Проект не может быть пустым!'})
    content?: string;

    @ApiProperty({ description: 'Тип проекта', required: false, default: Type.PROJECT, example: 'Проект', examples: ['Проект', 'Программа'] })
    @IsOptional()
    @IsEnum(Type)
    @IsNotEmpty({message: 'Выберите тип проекта!'})
    type?: Type; //default project

    @ApiProperty({ description: 'IDs организаций, которые связать с проектом', example: ['3388c410-2e2e-4fd3-8672-217a6121ed7a'] })
    @IsArray({message: 'Должен быть массив!'})
    @ArrayNotEmpty({message: 'Выберите хотя бы одну организацию!'})
    projectToOrganizations: string[];

    @ApiProperty({ description: 'Id стратегии', required: false, example: 'd5eaa436-f93f-4743-854a-6f10a5d290a1' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({message: 'Выберите стратегию для проекта!'})
    strategyId?: string;

    @Exclude({ toPlainOnly: true })
    strategy: Strategy; // nullable

    @Exclude({ toPlainOnly: true })
    account: Account;

    @Exclude({ toPlainOnly: true })
    user: User;

    @ApiProperty({
        description: 'Список задач', example: 
        [
            {
                type: 'Продукт',
                commonNumber: null,
                statisticNumber: null,
                ruleNumber: null,
                productNumber: 1,
                content: 'Контент задачи',
                holderUserId: 'fda96355-15f9-45b2-9fee-cc5b85201195',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
            {
                type: 'Обычная',
                commonNumber: 1,
                statisticNumber: null,
                ruleNumber: null,
                productNumber: null,
                content: 'Контент задачи',
                holderUserId: 'fda96355-15f9-45b2-9fee-cc5b85201195',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
            {
                type: 'Правила',
                commonNumber: null,
                statisticNumber: null,
                ruleNumber: 1,
                productNumber: null,
                content: 'Контент задачи',
                holderUserId: 'fda96355-15f9-45b2-9fee-cc5b85201195',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
        ]
    })
    @IsArray({message: 'Должен быть массив!'})
    targetCreateDtos?: TargetCreateDto[] //nullable
}


// не может быть активным пока нет 1 задачи "продукт" и 1 задачи "обычная"