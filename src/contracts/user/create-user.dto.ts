import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Account } from 'src/domains/account.entity';
import { Organization } from 'src/domains/organization.entity';
import { Post } from 'src/domains/post.entity';
import { Role } from 'src/domains/role.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'ID юзера',
    required: false,
    example: '675a797e-d0f2-4907-bad5-25733c3e2380',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Имя юзера', required: true, example: 'Максик' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Фамилия юзера',
    required: true,
    example: 'Ковальский',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Отчество юзера',
    required: true,
    example: 'Тимофеевич',
  })
  @IsString()
  @IsNotEmpty()
  middleName: string;

  @ApiProperty({
    description: 'Номер телефона',
    required: true,
    example: '+79787878778',
  })
  @IsMobilePhone('ru-RU', {strictMode: true})
  @IsNotEmpty()
  telephoneNumber: string;

  @ApiProperty({
    description: 'Путь к аватарке',
    required: false,
    example: '/uploads/111.jpg',
  })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({
    description: 'ID роли',
    required: false,
    example: '675a797e-d0f2-4907-bad5-25733c3e2380',
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiProperty({
    description: 'ID поста',
    required: false,
    example: '675a797e-d0f2-4907-bad5-25733c3e2380',
  })
  @IsOptional()
  @IsUUID()
  postId?: string;

  @ApiProperty({
    description: 'ID организации',
    required: false,
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @Exclude({ toPlainOnly: true })
  role: Role;

  @Exclude({ toPlainOnly: true })
  organization?: Organization;

  @Exclude({ toPlainOnly: true })
  account: Account;
}

// add middlename
