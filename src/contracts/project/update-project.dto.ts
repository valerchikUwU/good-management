import { Type } from "src/domains/project.entity";
import { TargetCreateDto } from "../target/create-target.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { TargetUpdateDto } from "../target/update-target.dto";
import { Exclude } from "class-transformer";
import { Organization } from "src/domains/organization.entity";
import { Strategy } from "src/domains/strategy.entity";

export class ProjectUpdateDto {
    
    @ApiProperty({ description: 'Id обновляемого проекта', required: true, example: 'f2c217bc-367b-4d72-99c3-37d725306786' })
    @IsUUID()
    @IsNotEmpty({message: 'ID проекта не может быть пустым!'})
    _id: string

    @ApiProperty({ description: 'Название проекта', required: true, example: 'Название проекта' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Название проекта не может быть пустым!'})
    projectName: string;

    @ApiProperty({ description: 'Id программы', required: false, example: 'b6ed2664-9510-4a47-9117-6ce89903b4b5' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({message: 'ID программы не может быть пустым!'})
    programId?: string;

    @ApiProperty({ description: 'Содержание проекта', required: false, example: 'Контент проекта' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Проект не может быть пустым!'})
    content?: string;

    @ApiProperty({ description: 'Тип проекта', required: false, example: 'Проект', examples: ['Проект', 'Программа'] })
    @IsOptional()
    @IsEnum(Type)
    type?: Type;

    @ApiProperty({ description: 'ID организации, с которой связать проект', required: false, example: '1f1cca9a-2633-489c-8f16-cddd411ff2d0' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({message: 'Выберите организацию!'})
    organizationId?: string;

    @ApiProperty({ description: 'ID стратегии, которую связать с проектом', required: false, example: '221cca9a-2633-489c-8f16-cddd411ff2d0' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({message: 'Выберите стратегию!'})
    strategyId?: string;

    @Exclude({toPlainOnly: true})
    organization: Organization;

    @Exclude({toPlainOnly: true})
    strategy: Strategy;

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
    targetCreateDtos?: TargetCreateDto[];


    @ApiProperty({
        description: 'Список задач', required: false, example: 
        [
            {
                _id: '7a269e8f-26ba-46da-9ef9-e1b17475b6d9',
                content: 'Контент задачи обновленный',
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
                dateStart: '2023-09-18T14:59:47.010Z',
                deadline: '2023-09-18T14:59:47.010Z',
            }
        ]
    })
    @IsOptional()
    @IsArray({message: 'Должен быть массив!'})
    targetUpdateDtos?: TargetUpdateDto[]
}


// не может быть активным пока нет 1 задачи "продукт" и 1 задачи "обычная"