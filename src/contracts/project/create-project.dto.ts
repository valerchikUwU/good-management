import { Account } from "src/domains/account.entity";
import { Type } from "src/domains/project.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";
import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";

export class ProjectCreateDto{
    programId: string;
    content: string;
    type: Type;
    projectToOrganizations: string[];
    strategy: Strategy;
    account: Account;
    user: User
}