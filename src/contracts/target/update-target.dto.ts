import { ApiExtraModels } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Project } from "src/domains/project.entity";
import { Type } from "src/domains/target.entity";
import { TargetHolder } from "src/domains/targetHolder.entity";

@ApiExtraModels()
export class TargetUpdateDto{
    _id: string;
    content?: string;
    holderUserId?: string;
    dateStart?: Date;
    deadline?: Date;
}