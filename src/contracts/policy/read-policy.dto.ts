import { Account } from "src/domains/account.entity";
import { State, Type } from "src/domains/policy.entity";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { Post } from "src/domains/post.entity";
import { User } from "src/domains/user.entity";

export class PolicyReadDto{
    id: string
    policyName: string
    state: State;
    type: Type;
    dateActive: Date;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
    policyToOrganizations: PolicyToOrganization[];
    user: User;
    account: Account
}