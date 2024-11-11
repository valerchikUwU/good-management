import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { State } from 'src/domains/target.entity';
import { User } from 'src/domains/user.entity';

@ApiExtraModels()
export class TargetUpdateDto {
  @ApiProperty({
    description: 'Id обновляемой задачи',
    required: true,
    example: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Id не может быть пустой' })
  _id: string;

  @ApiProperty({
    description: 'Содержание задачи',
    required: false,
    example: 'Контент задачи',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Задача не может быть пустой!' })
  content?: string;

  @ApiProperty({
    description: 'Порядковый номер задачи (минимум 1)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  orderNumber?: number;

  @ApiProperty({
    description: 'Id ответственного юзера',
    required: false,
    example: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({ message: 'Id ответственного не может быть пустой' })
  holderUserId?: string;

  @ApiProperty({
    description: 'Состояние задачи',
    required: false,
    example: 'Отменена',
    examples: ['Отменена', 'Завершена'],
  })
  @IsOptional()
  @IsEnum(State)
  targetState?: State;

  @ApiProperty({
    description: 'Дата начала выполнения (default: new Date())',
    required: false,
    default: new Date(),
    example: '2024-09-16 17:03:31.000111',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateStart?: Date;

  @ApiProperty({
    description: 'Дедлайн',
    required: false,
    nullable: true,
    example: '2025-09-16 17:03:31.000111',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;

  @Exclude({ toPlainOnly: true })
  holderUser: User;
}
