import { ObjectiveToOrganization } from "src/domains/objectiveToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveCreateDto{
    orderNumber: number;
    situation: string;
    content: string
    rootCause: string;
    objectiveToOrganizations: string[]
    strategy: Strategy
}