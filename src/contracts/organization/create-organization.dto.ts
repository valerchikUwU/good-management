import { Account } from "src/domains/account.entity";
import { Post } from "src/domains/post.entity";
import { User } from "src/domains/user.entity";



export class OrganizationCreateDto {
    organizationName: string;
    parentOrganizationId: string
    account: Account;
}