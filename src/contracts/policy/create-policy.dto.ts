import { State } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";


export class PolicyCreateDto{
    policyName: string
    state: State;
    path: string;
    size: number;
    mimetype: string;
    user: User
}