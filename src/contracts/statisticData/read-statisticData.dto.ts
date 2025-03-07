import { CorrelationType } from 'src/domains/statisticData.entity';

export class StatisticDataReadDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  value: number;
  valueDate: Date;
  isCorrelation: CorrelationType;
}
