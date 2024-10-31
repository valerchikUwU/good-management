
export class PostUpdateEventDto {
    eventType: string;
    id: string;
    postName: string;
    divisionName: string | null;
    parentId: string | null;
    product: string;
    purpose: string;
    updatedAt: Date;
    policyId: string;
    responsibleUserId: string | null;
    organizationId: string | null;
    accountId: string;
}