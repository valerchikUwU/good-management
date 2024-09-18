import { Account } from "src/domains/account.entity";
import { Type } from "src/domains/project.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";

export class ProjectReadDto{
    id: string;
    programId: string;
    content: string;
    type: Type;
    account: Account;
    user: User
    projectToOrganizations: ProjectToOrganization[]
    targets: Target[]
}