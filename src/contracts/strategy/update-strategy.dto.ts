import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Organization } from 'src/domains/organization.entity';
import { State } from 'src/domains/strategy.entity';

export class StrategyUpdateDto {
  @ApiProperty({
    description: 'Id стратегии',
    example: '21dcf96d-1e6a-4c8c-bc12-c90589b40e93',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'ID стратегии не может быть пустым!' })
  _id: string;

  @ApiProperty({
    description: 'Состояние стратегии',
    required: false,
    example: 'Черновик',
    examples: ['Черновик', 'Активный', 'Завершено'],
  })
  @IsOptional()
  @IsEnum(State)
  state?: State;

  @ApiProperty({
    description: 'Контент стратегии',
    required: false,
    example: 'Контент',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Содержание стратегии не может быть пустым!' })
  content?: string;
}
