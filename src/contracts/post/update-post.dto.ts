import { ApiProperty } from "@nestjs/swagger";
import { notEqual } from "assert";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";
import { Organization } from "src/domains/organization.entity";
import { Policy } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";

export class PostUpdateDto {

    @ApiProperty({description: 'Id поста', example: '2420fabb-3e37-445f-87e6-652bfd5a050c'})
    @IsNotEmpty({ message: 'ID обновляемого поста не может быть пустым!' })
    @IsUUID()
    _id: string

    @ApiProperty({ description: 'Название поста', example: 'Директор' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Название поста не может быть пустым!' })
    postName?: string;
    
    @ApiProperty({required: false, description: 'Название отдела', example: 'Отдел продаж' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Название отдела не может быть пустым!' })
    divisionName?: string;
    
    @ApiProperty({required: false, description: 'Родительский пост', example: '87af2eb9-a17d-4e78-b847-9d512cb9a0c9' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({ message: 'ID родительского поста не может быть пустым!' })
    parentId?: string;

    @ApiProperty({ description: 'Продукт поста', example: 'Продукт' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Продукт не может быть пустым!' })
    product?: string;
    
    @ApiProperty({ description: 'Назначение поста', example: 'Предназначение поста' })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Предназначение поста не может быть пустым!' })
    purpose?: string

    @ApiProperty({ description:'ID ответственного, с которым связать пост', example: '3b809c42-2824-46c1-9686-dd666403402a'})
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({ message: 'ID ответственного лица не может быть пустым!' })
    responsibleUserId?: string

    @ApiProperty({ description:'ID организации, с которой связать пост', example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f'})
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({ message: 'ID организации не может быть пустым!' })
    organizationId?: string

    @Exclude({toPlainOnly: true})
    user: User;

    @Exclude({toPlainOnly: true})
    organization: Organization
    
}


// STATE: 'Активный', 'Архивный', 'Вакантный'