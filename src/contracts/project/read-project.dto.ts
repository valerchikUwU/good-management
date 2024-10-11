import { Account } from "src/domains/account.entity";
import { Type } from "src/domains/project.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { Strategy } from "src/domains/strategy.entity";
import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";

export class ProjectReadDto{
    id: string;
    projectNumber: number;
    programId: string;
    content: string;
    programNumber?: number | null
    type: Type;
    createdAt: Date;
    updatedAt: Date;
    projectToOrganizations: ProjectToOrganization[];
    targets: Target[];
    strategy: Strategy;
    account: Account;
    user: User
}