import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";

export class TargetCreateDto{
    type: Type;
    orderNumber: number;
    content: string;
    dateStart: Date
    deadline: Date
    targetHolder: TargetHolder;
    project: Project
}