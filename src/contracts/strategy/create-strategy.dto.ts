import { State } from "src/domains/strategy.entity";
import { User } from "src/domains/user.entity";

export class StrategyCreateDto{
    strategyNumber: number;
    strategyName: string;
    path: string;
    size: number;
    mimetype: string;
    state: State;
    strategyToOrganizations: string[]
    user: User;
}