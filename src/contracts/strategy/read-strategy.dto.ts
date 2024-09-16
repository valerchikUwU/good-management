import { Objective } from "src/domains/objective.entity";
import { State } from "src/domains/strategy.entity";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { User } from "src/domains/user.entity";

export class StrategyReadDto{
    id: string;
    strategyNumber: number;
    strategyName: string;
    dateActive: Date
    path: string;
    size: number;
    mimetype: string;
    state: State;
    createdAt: Date;
    updatedAt: Date;
    user: User
    strategyToOrganizations: StrategyToOrganization[]
    objectives: Objective[]
}