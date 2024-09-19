import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Organization } from "src/domains/organization.entity";
import { Policy } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PostCreateDto {
    
    @ApiProperty({ description: 'Название поста', example: 'Директор' })
    postName: string;
    
    @ApiProperty({required: false, description: 'Название отдела', example: 'Отдел продаж' })
    divisionName?: string | null;
    
    @ApiProperty({required: false, description: 'Родительский пост', example: 'b2218813-8985-465b-848e-9a78b1627f11' })
    parentId?: string | null;

    @ApiProperty({ description: 'Продукт поста', example: 'Продукт' })
    product: string;
    
    @ApiProperty({ description: 'Назначение поста', example: 'Предназначение поста' })
    purpose: string
    
    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    organization: Organization

    @Exclude({toPlainOnly: true})
    policy: Policy;

    @ApiProperty({ description:'ID организации, с которой связать пост', example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f'})
    organizationId?: string
}