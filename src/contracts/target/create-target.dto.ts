import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";

export class TargetCreateDto{
    type: Type;
    commonNumber?: number | null;
    statisticNumber?: number | null;
    ruleNumber?: number | null;
    productNumber?: number | null;
    content: string;
    holderUserId: string;
    dateStart: Date;
    deadline: Date;
    project: Project;
}