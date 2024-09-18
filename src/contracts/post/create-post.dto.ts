import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Organization } from "src/domains/organization.entity";
import { Policy } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PostCreateDto {
    
    @ApiProperty({ description: 'Название поста' })
    postName: string;
    
    @ApiProperty({required: false, description: 'Название отдела' })
    divisionName?: string | null;
    
    @ApiProperty({required: false, description: 'Родительский пост' })
    parentId?: string | null;

    @ApiProperty({ description: 'Продукт поста' })
    product: string;
    
    @ApiProperty({ description: 'Назначение поста' })
    purpose: string
    
    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    organization: Organization

    @Exclude({toPlainOnly: true})
    policy: Policy;

    @ApiProperty({ description:'ID организации, с которой связать пост'})
    organizationId?: string
}