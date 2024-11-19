export class PolicyUpdateEventDto {
  eventType: string;
  id: string;
  policyName: string | null;
  state: string | null;
  type: string | null;
  content: string | null;
  updatedAt: Date;
  organizationId: string | null; // Ids организаций, с которыми связать политику. У меня политика и организации M:M.
  accountId: string;
}
