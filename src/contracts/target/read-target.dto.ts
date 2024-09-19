import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";

export class TargetReadDto{
    id: string;
    type: Type;
    commonNumber: number | null;
    statisticNumber: number | null;
    ruleNumber: number | null;
    productNumber: number | null;
    content: string;
    dateStart: Date
    deadline: Date
    dateComplete: Date
    createdAt: Date;
    updatedAt: Date;
    targetHolder: TargetHolder;
    project: Project
}