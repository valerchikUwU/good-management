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
import { Account } from 'src/domains/account.entity';
import { Organization } from 'src/domains/organization.entity';
import { State, Type } from 'src/domains/policy.entity';
import { User } from 'src/domains/user.entity';

export class PolicyCreateDto {
  @ApiProperty({ description: 'Название политики', example: 'Политика' })
  @IsString()
  @IsNotEmpty({ message: 'Название политики не может быть пустым!' })
  policyName: string;

  @ApiProperty({
    description: 'Состояние политики',
    required: false,
    default: State.DRAFT,
    example: 'Черновик',
    examples: ['Черновик', 'Активный', 'Отменён'],
  })
  @IsOptional()
  @IsEnum(State)
  state?: State;

  @ApiProperty({
    description: 'Тип политики',
    example: 'Директива',
    required: false,
    default: Type.DIRECTIVE,
    examples: ['Директива', 'Инструкция'],
  })
  @IsOptional()
  @IsEnum(Type)
  type?: Type; // DEFALUT DIRECTIVA

  @ApiProperty({
    description: 'HTML контент политики',
    required: true,
    example: 'HTML контент (любая строка пройдет)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Содержание политики не может быть пустым!' })
  content: string;

  @Exclude({ toPlainOnly: true })
  user: User;

  @Exclude({ toPlainOnly: true })
  account: Account;

  @Exclude({ toPlainOnly: true })
  organization: Organization;

  @ApiProperty({
    description: 'ID организации, к которой привязать политику',
    example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
  })
  @IsUUID()
  @IsNotEmpty({message: 'ID организации не может быть пустым!'})
  organizationId: string;
}
