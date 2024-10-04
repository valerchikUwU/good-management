import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Account } from "src/domains/account.entity";
import { Organization } from "src/domains/organization.entity";
import { Policy } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PostUpdateDto {

    @ApiProperty({description: 'Id поста', example: '2420fabb-3e37-445f-87e6-652bfd5a050c'})
    _id: string

    @ApiProperty({ description: 'Название поста', example: 'Директор' })
    postName?: string;
    
    @ApiProperty({required: false, description: 'Название отдела', example: 'Отдел продаж' })
    divisionName?: string;
    
    @ApiProperty({required: false, description: 'Родительский пост', example: '87af2eb9-a17d-4e78-b847-9d512cb9a0c9' })
    parentId?: string;

    @ApiProperty({ description: 'Продукт поста', example: 'Продукт' })
    @IsString()
    @IsNotEmpty()
    product?: string;
    
    @ApiProperty({ description: 'Назначение поста', example: 'Предназначение поста' })
    @IsString()
    @IsNotEmpty()
    purpose?: string

    @ApiProperty({ description:'ID ответственного, с которым связать пост', example: '3b809c42-2824-46c1-9686-dd666403402a'})
    responsibleUserId?: string

    @ApiProperty({ description:'ID организации, с которой связать пост', example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f'})
    organizationId?: string

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    organization: Organization
    
}