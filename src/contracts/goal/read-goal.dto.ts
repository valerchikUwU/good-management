import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { User } from "src/domains/user.entity";

export class GoalReadDto{
    id: string;
    goalName: string;
    orderNumber: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User
    goalToOrganizations: GoalToOrganization[]

}