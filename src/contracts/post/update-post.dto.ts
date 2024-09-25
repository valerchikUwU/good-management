import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
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
    
    @ApiProperty({required: false, description: 'Родительский пост', example: 'b2218813-8985-465b-848e-9a78b1627f11' })
    parentId?: string;

    @ApiProperty({ description: 'Продукт поста', example: 'Продукт' })
    product?: string;
    
    @ApiProperty({ description: 'Назначение поста', example: 'Предназначение поста' })
    purpose?: string
    
}