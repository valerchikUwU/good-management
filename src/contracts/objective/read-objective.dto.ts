import { ObjectiveToOrganization } from "src/domains/objectiveToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveReadDto{
    id: string;
    orderNumber: number;
    situation: string;
    content: string
    rootCause: string;
    createdAt: Date;
    updatedAt: Date;
    objectiveToOrganizations: ObjectiveToOrganization[]
    strategy: Strategy
}