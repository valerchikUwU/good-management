import { Account } from "src/domains/account.entity";
import { Objective } from "src/domains/objective.entity";
import { Project } from "src/domains/project.entity";
import { State } from "src/domains/strategy.entity";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { User } from "src/domains/user.entity";

export class StrategyUpdateDto{
    _id: string;
    strategyName?: string;
    content?: string;
    strategyToOrganizations?: string[];
}