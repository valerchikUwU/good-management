import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';

export class StatisticUpdateBulkDto {
  @ApiProperty({
    description: 'Id обновляемых статистик',
    required: true,
    example: ['099f554d-3539-4c7c-b4ae-dc7bea092f22'],
  })
  @IsArray()
  @ArrayNotEmpty()
  ids: string[];
}
