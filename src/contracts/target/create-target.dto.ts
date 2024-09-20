import { ApiExtraModels } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";

@ApiExtraModels()
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
    
    @Exclude({toPlainOnly: true})
    project: Project;
}