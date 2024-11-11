import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Account } from 'src/domains/account.entity';
import { Organization } from 'src/domains/organization.entity';
import { User } from 'src/domains/user.entity';

export class GoalCreateDto {
  @ApiProperty({
    description: 'Текст цели',
    isArray: true,
    example: ['Контент цели', 'one more content'],
  })
  @IsArray()
  @IsNotEmpty({ message: 'Содержание не может быть пустым!' })
  content: string[];

  @ApiProperty({
    description: 'ID организации, с которой связать цель',
    example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'ID организации не может быть пустой!' })
  organizationId: string;

  @Exclude({ toPlainOnly: true })
  user: User;

  @Exclude({ toPlainOnly: true })
  account: Account;

  @Exclude({ toPlainOnly: true })
  organization: Organization;
}
