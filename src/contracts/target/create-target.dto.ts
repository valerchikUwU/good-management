import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  min,
} from 'class-validator';
import { Attachment } from 'src/domains/attachment.entity';
import { Convert } from 'src/domains/convert.entity';
import { Policy } from 'src/domains/policy.entity';
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
      'Приказ'
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
    example: 'a065a77a-36b0-4aea-9af4-5b313e550c19',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Id ответственного поста не может быть пустым' })
  holderPostId: string;

  @ApiProperty({
    description: 'Id поста отправителя приказа',
    required: false,
    example: '261fcded-bb76-4956-a950-a19ab6e2c2fd',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({ message: 'Id поста отправителя не может быть пустым' })
  senderPostId?: string;

  @ApiProperty({
    description: 'Id политики',
    required: false,
    example: '0d081ac3-200f-4c7c-adc8-d11f1f66b20a',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({ message: 'Id политики не может быть пустым' })
  policyId?: string;

  @ApiProperty({
    description: 'Ids файлов',
    required: false,
    example: ['0d081ac3-200f-4c7c-adc8-d11f1f66b20a'],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Ids файлов не может быть пустым' })
  attachmentIds?: string[];

  @ApiProperty({
    description: 'Состояние задачи',
    required: false,
    example: 'Отменена',
    examples: ['Отменена', 'Завершена', 'Активная'],
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
    example: '2025-09-16 17:03:31.000111',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;

  @Exclude({ toPlainOnly: true })
  senderPost: Post;

  @Exclude({ toPlainOnly: true })
  holderPost: Post;

  @Exclude({ toPlainOnly: true })
  project: Project;

  @Exclude({ toPlainOnly: true })
  policy: Policy;

  @Exclude({ toPlainOnly: true })
  convert: Convert;
}
