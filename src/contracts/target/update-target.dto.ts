import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels()
export class TargetUpdateDto{
    _id: string;
    content?: string;
    orderNumber?: number;
    holderUserId?: string;
    dateStart?: Date;
    deadline?: Date;
}