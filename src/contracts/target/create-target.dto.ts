import { ApiExtraModels } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Project } from "src/domains/project.entity";
import { State, Type } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";

@ApiExtraModels()
export class TargetCreateDto{
    type?: Type; // default common
    orderNumber: number; // change in domain
    content: string;
    holderUserId: string;
    targetState?: State;
    dateStart?: Date; //default createdAt
    deadline?: Date;
    @Exclude({toPlainOnly: true})
    holderUser: User
    @Exclude({toPlainOnly: true})
    project: Project; // nullable
}