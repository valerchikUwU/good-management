export class StrategyCreateEventDto{
    eventType: string;
    id: string;
    content: string;
    userId: string;
    accountId: string;
    strategyToOrganizations: string[] // Ids организаций, с которыми связать стратегию. У меня стратегия и организация M:M. 
}