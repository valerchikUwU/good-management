import { Statistic } from "src/domains/statistic.entity";


export class StatisticDataReadDto{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    value: number;
}