import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/domains/account.entity";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { Post } from "src/domains/post.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { User } from "src/domains/user.entity";



export class OrganizationUpdateDto {
    
    @ApiProperty({ description: 'ID организации' })
    _id: string;
    
    @ApiProperty({ description: 'Название организации' })
    organizationName?: string;
    
    @ApiProperty({ description: 'ID родительской организации' })
    parentOrganizationId?: string
}