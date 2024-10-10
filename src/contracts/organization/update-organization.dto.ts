import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";



export class OrganizationUpdateDto {
    
    @ApiProperty({ description: 'ID организации' })
    @IsUUID()
    @IsNotEmpty()
    _id: string;
    
    @ApiProperty({ description: 'Название организации' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    organizationName?: string;
    
    @ApiProperty({ description: 'ID родительской организации' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    parentOrganizationId?: string
}