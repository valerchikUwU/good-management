import { Account } from "src/domains/account.entity";
import { Type } from "src/domains/project.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";
import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";
import { TargetCreateDto } from "../target/create-target.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsUUID } from "class-validator";
import { TargetUpdateDto } from "../target/update-target.dto";

export class ProjectUpdateDto {
    
    @ApiProperty({ description: 'Id обновляемого проекта', required: true, example: 'f2c217bc-367b-4d72-99c3-37d725306786' })
    @IsUUID()
    _id: string

    @ApiProperty({ description: 'Id программы', required: false, example: 'b6ed2664-9510-4a47-9117-6ce89903b4b5' })
    programId?: string;

    @ApiProperty({ description: 'Содержание проекта', example: 'Контент проекта' })
    content?: string;

    @ApiProperty({ description: 'Тип проекта', example: 'Проект', examples: ['Проект', 'Программа'] })
    type?: Type;

    @ApiProperty({ description: 'IDs организаций, которые связать с проектом', example: ['1f1cca9a-2633-489c-8f16-cddd411ff2d0'] })
    projectToOrganizations?: string[];

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
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
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
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
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
                holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
                dateStart: '2024-09-18T14:59:47.010Z',
                deadline: '2024-09-18T14:59:47.010Z',
            },
        ]
    })
    targetCreateDtos?: TargetCreateDto[];


    @ApiProperty({
        description: 'Список задач', example: 
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
    targetUpdateDtos?: TargetUpdateDto[]
}