import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";
import { Organization } from "src/domains/organization.entity";
import { Policy } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PostCreateDto {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string;
    
    @ApiProperty({ description: 'Название поста', example: 'Директор' })
    @IsString()
    @IsNotEmpty({message: 'Название поста не может быть пустым!'})
    postName: string;
    
    @ApiProperty({required: false, description: 'Название отдела', example: 'Отдел продаж' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Название отдела не может быть пустым!'})
    divisionName?: string;
    
    @ApiProperty({required: false, description: 'Родительский пост', example: 'b2218813-8985-465b-848e-9a78b1627f11' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    parentId?: string;

    @ApiProperty({ description: 'Продукт поста', example: 'Продукт' })
    @IsString()
    @IsNotEmpty({message: 'Продукт поста не может быть пустым!'})
    product: string;
    
    @ApiProperty({ description: 'Назначение поста', example: 'Предназначение поста' })
    @IsString()
    @IsNotEmpty({message: 'Предназначение поста не может быть пустым!'})
    purpose: string
    
    @Exclude({toPlainOnly: true}) // nullable
    user: User;

    @Exclude({toPlainOnly: true}) // nullable
    organization: Organization

    @Exclude({toPlainOnly: true})
    policy: Policy;

    @Exclude({toPlainOnly: true})
    account: Account;

    @ApiProperty({ description:'ID ответственного, с которым связать пост', required: false, example: '3b809c42-2824-46c1-9686-dd666403402a'})
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    responsibleUserId?: string

    @ApiProperty({ description:'ID организации, с которой связать пост', required:false, example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f'})
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    organizationId?: string
}