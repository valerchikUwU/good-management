import { ApiExtraModels } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";

@ApiExtraModels()
export class TargetCreateDto{
    type: Type; // default common
    orderNumber?: number; // change in domain
    content: string;
    holderUserId: string;
    dateStart?: Date; //default createdAt
    deadline?: Date;
    
    @Exclude({toPlainOnly: true})
    project: Project; // nullable
}