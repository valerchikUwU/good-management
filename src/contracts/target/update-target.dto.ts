import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels()
export class TargetUpdateDto{
    _id: string;
    content?: string;
    holderUserId?: string;
    dateStart?: Date;
    deadline?: Date;
}