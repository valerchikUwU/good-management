export class StatisticDataCreateEventDto{
    id: string;
    value: number;
    valueDate: Date;
    createdAt: Date;
    isCorrelation: boolean;
    statisticId: string;
    accountId: string;
}

