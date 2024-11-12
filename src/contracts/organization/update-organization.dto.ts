import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportDay } from 'src/domains/organization.entity';

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

  @ApiProperty({ description: 'Отчетный день' })
  @IsOptional()
  @IsEnum(ReportDay)
  reportDay?: ReportDay;

  @ApiProperty({ description: 'ID родительской организации' })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  parentOrganizationId?: string;
}
