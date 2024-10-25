
export class PolicyCreateEventDto{
    eventType: string;
    id: string;
    policyName: string;
    state: string;
    type: string; 
    content: string;
    createdAt: Date;
    userId: string;
    accountId: string;
    policyToOrganizations: string[];
}