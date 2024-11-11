export class StrategyUpdateEventDto {
  eventType: string;
  id: string;
  state: string | null;
  content: string | null;
  organizationId: string | null;
}
