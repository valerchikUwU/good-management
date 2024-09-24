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

    @ApiProperty({ description: 'IDs организаций, которые связать с проектом', example: ['3388c410-2e2e-4fd3-8672-217a6121ed7a'] })
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
    targetCreateDtos?: TargetCreateDto[];
    
    targetUpdateDtos?: TargetUpdateDto[]
}