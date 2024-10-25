export class StrategyCreateEventDto{
    eventType: string;
    id: string;
    content: string;
    userId: string;
    accountId: string;
    strategyToOrganizations: string[]
}