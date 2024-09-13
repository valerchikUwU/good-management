import { GoalToOrganization } from "src/domains/goalToOrganization.entity";


export class GoalCreateDto {
    goalName: string;
    orderNumber: number;
    content: string;
    goalToOrganizations: string[]
}