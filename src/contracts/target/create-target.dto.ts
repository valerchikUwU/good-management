import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  min,
} from 'class-validator';
import { Post } from 'src/domains/post.entity';
import { Project } from 'src/domains/project.entity';
import { State, Type as TypeTarget } from 'src/domains/target.entity';

@ApiExtraModels()
export class TargetCreateDto {
  @ApiProperty({
    description: 'Тип задачи',
    required: false,
    default: 'Обычная',
    example: 'Обычная',
    examples: [
      'Обычная',
      'Статистика',
      'Правила',
      'Продукт',
      'Организационные мероприятия',
    ],
  })
  @IsOptional()
  @IsEnum(TypeTarget)
  type?: TypeTarget;

  @ApiProperty({
    description: 'Порядковый номер задачи (минимум 1)',
    required: true,
    example: 1,
  })
  @IsNumber()
  @Min(1)
  orderNumber: number;

  @ApiProperty({
    description: 'Содержание задачи',
    required: true,
    example: 'Контент задачи',
  })
  @IsString()
  @IsNotEmpty({ message: 'Задача не может быть пустой!' })
  content: string;

  @ApiProperty({
    description: 'Id ответственного поста',
    required: true,
    example: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Id ответственного поста не может быть пустым' })
  holderPostId: string;

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
  holderPost: Post;
  @Exclude({ toPlainOnly: true })
  project: Project;
}
