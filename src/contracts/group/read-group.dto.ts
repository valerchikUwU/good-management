import { Account } from "src/domains/account.entity";
import { GroupToUser } from "src/domains/groupToUser.entity";

export class GroupReadDto{
    
    id: string;
    groupName: string;
    groupNumber: number;
    createdAt: Date;
    updatedAt: Date;
    groupToUsers: GroupToUser[];
    account: Account;

}