export class ObjectiveUpdateEventDto {
  eventType: string;
  id: string;
  situation: string[] | null;
  content: string[] | null;
  rootCause: string[] | null;
  updatedAt: Date;
  strategyId: string | null;
  accountId: string;
}
