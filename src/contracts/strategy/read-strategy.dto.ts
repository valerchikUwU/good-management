import { Account } from "src/domains/account.entity";
import { Objective } from "src/domains/objective.entity";
import { Project } from "src/domains/project.entity";
import { State } from "src/domains/strategy.entity";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { User } from "src/domains/user.entity";

export class StrategyReadDto{
    id: string;
    strategyNumber: number;
    strategyName: string;
    dateActive: Date
    content: string;
    state: State;
    createdAt: Date;
    updatedAt: Date;
    user: User
    account: Account
    strategyToOrganizations: StrategyToOrganization[];
    objective: Objective;
    projects: Project[];
}