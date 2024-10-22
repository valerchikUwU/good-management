import { IsArray, IsUUID } from "class-validator";


export class ConvertUpdateDto{
    @IsUUID()
    _id: string
    @IsArray()
    userIds: string[];
}