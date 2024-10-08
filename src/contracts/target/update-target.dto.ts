import { ApiExtraModels } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "src/domains/user.entity";

@ApiExtraModels()
export class TargetUpdateDto{
    _id: string;
    content?: string;
    orderNumber?: number;
    holderUserId?: string;
    dateStart?: Date;
    deadline?: Date;
        
    @Exclude({toPlainOnly: true})
    holderUser?: User
}