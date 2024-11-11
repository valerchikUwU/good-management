export class TargetUpdateEventDto {
  id: string;
  orderNumber: number | null;
  content: string | null;
  updatedAt: Date;
  holderUserId: string | null;
  targetState: string | null;
  dateStart: Date | null;
  deadline: Date | null;
  projectId: string;
  accountId: string;
}
