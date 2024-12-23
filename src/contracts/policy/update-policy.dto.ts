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
import { State, Type } from 'src/domains/policy.entity';

export class PolicyUpdateDto {
  @ApiProperty({
    description: 'Id обновляемой политики',
    required: true,
    example: '0ba305e6-1d80-4ff6-a436-93d118f99993',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'ID политики не может быть пустым!' })
  _id: string;

  @ApiProperty({
    description: 'Название политики',
    required: false,
    example: 'Политика',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Название политики не может быть пустым!' })
  policyName?: string;

  @ApiProperty({
    description: 'Состояние политики',
    required: false,
    example: 'Черновик',
    examples: ['Черновик', 'Активный', 'Отменён'],
  })
  @IsOptional()
  @IsEnum(State)
  state?: State;

  @ApiProperty({
    description: 'Тип политики',
    required: false,
    example: 'Директива',
    examples: ['Директива', 'Инструкция'],
  })
  @IsOptional()
  @IsEnum(Type)
  type?: Type;

  @ApiProperty({
    description: 'HTML контент политики',
    required: false,
    example: 'HTML контент (любая строка пройдет)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Содержание политики не может быть пустым!' })
  content?: string;
}
