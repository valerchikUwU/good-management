export class TargetCreateEventDto{
    id: string;
    type: string; 
    orderNumber: number; 
    content: string;
    createdAt: Date;
    holderUserId: string;
    targetState: string;
    dateStart: Date; 
    deadline: Date | null;
    projectId: string; 
    accountId: string;
}