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

    @ApiProperty({ description: 'IDs организаций, которые связать с проектом', example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'] })
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
        description: 'Список задач', required: false, example: 
        [
            {
                type: 'Продукт',
                orderNumber: 1,
                content: 'Контент задачи',
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
            {
                type: 'Обычная',
                orderNumber: 1,
                content: 'Контент задачи',
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
            {
                type: 'Правила',
                orderNumber: 1,
                content: 'Контент задачи',
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
        ]
    })
    @IsOptional()
    @IsArray({message: 'Должен быть массив!'})
    targetCreateDtos?: TargetCreateDto[] //nullable
}


// не может быть активным пока нет 1 задачи "продукт" и 1 задачи "обычная"