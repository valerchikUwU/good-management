import { IsUUID } from "class-validator";



export class ObjectiveUpdateDto{
    
    @IsUUID()
    _id: string;
    orderNumber?: number;
    situation?: string;
    content?: string
    rootCause?: string;
}