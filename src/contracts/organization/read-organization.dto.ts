import { Account } from "src/domains/account.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { ObjectiveToOrganization } from "src/domains/objectiveToOrganization.entity";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { Post } from "src/domains/post.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { User } from "src/domains/user.entity";



export class OrganizationReadDto {
    id: string;
    organizationName: string;
    parentOrganizationId: string
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    posts: Post[];
    goalToOrganizations: GoalToOrganization[]
    objectiveToOrganizations: ObjectiveToOrganization[]
    policyToOrganizations: PolicyToOrganization[]
    projectToOrganizations: ProjectToOrganization[]
    strategyToOrganizations: StrategyToOrganization[]
    account: Account;
}