import { State } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PolicyReadDto{
    id: string
    policyName: string
    state: State;
    dateActive: Date
    path: string;
    size: number;
    mimetype: string;
    createdAt: Date;
    updatedAt: Date;
    user: User
}