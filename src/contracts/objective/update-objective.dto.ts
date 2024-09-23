import { Account } from "src/domains/account.entity";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveUpdateDto{
    _id: string;
    orderNumber?: number;
    situation?: string;
    content?: string
    rootCause?: string;
}