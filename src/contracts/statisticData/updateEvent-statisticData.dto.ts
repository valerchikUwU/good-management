export class StatisticDataUpdateEventDto{
    id: string;
    value: number | null;
    valueDate: Date | null;
    updatedAt: Date;
    statisticId: string;
    accountId: string;
}

