import { ApiExtraModels } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";
import { User } from "src/domains/user.entity";

@ApiExtraModels()
export class TargetCreateEventDto{
    id: string;
    type: string; // default common
    orderNumber: number; 
    content: string;
    createdAt: Date;
    holderUserId: string;
    dateStart: Date; //default createdAt
    deadline: Date | null;
    projectId: string; // nullable
}