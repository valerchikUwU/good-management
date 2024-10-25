export class TargetCreateEventDto{
    id: string;
    type: string; 
    orderNumber: number; 
    content: string;
    createdAt: Date;
    holderUserId: string;
    dateStart: Date; 
    deadline: Date | null;
    projectId: string; 
}