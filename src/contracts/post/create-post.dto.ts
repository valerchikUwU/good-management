import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";
import { Organization } from "src/domains/organization.entity";
import { Policy } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PostCreateDto {
    
    @ApiProperty({ description: 'Название поста', example: 'Директор' })
    @IsString()
    @IsNotEmpty()
    postName: string;
    
    @ApiProperty({required: false, description: 'Название отдела', example: 'Отдел продаж' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    divisionName?: string | null;
    
    @ApiProperty({required: false, description: 'Родительский пост', example: 'b2218813-8985-465b-848e-9a78b1627f11' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    parentId?: string | null;

    @ApiProperty({ description: 'Продукт поста', example: 'Продукт' })
    @IsString()
    @IsNotEmpty()
    product: string;
    
    @ApiProperty({ description: 'Назначение поста', example: 'Предназначение поста' })
    @IsString()
    @IsNotEmpty()
    purpose: string
    
    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    organization: Organization

    @Exclude({toPlainOnly: true})
    policy: Policy;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description:'ID ответственного, с которым связать пост', example: '3b809c42-2824-46c1-9686-dd666403402a'})
    @IsUUID()
    @IsNotEmpty()
    responsibleUserId: string

    @ApiProperty({ description:'ID организации, с которой связать пост', example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f'})
    @IsUUID()
    @IsNotEmpty()
    organizationId: string
}