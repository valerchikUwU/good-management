import { Organization } from "src/domains/organization.entity";
import { User } from "src/domains/user.entity";



export class AccountReadDto {
    id: string;
    accountName: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    organizations: Organization[];
}