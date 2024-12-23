import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/domains/account.entity';
import { State, Type } from 'src/domains/policy.entity';
import { Post } from 'src/domains/post.entity';
import { User } from 'src/domains/user.entity';
import { PolicyToPolicyDirectory } from 'src/domains/policyToPolicyDirectories.entity';
import { Organization } from 'src/domains/organization.entity';

export class PolicyReadDto {
  @ApiProperty({
    description: 'Id политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  id: string;

  @ApiProperty({
    description: 'Название политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  policyName: string;

  @ApiProperty({
    description: 'Номер политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  policyNumber: number;

  @ApiProperty({
    description: 'Состояние политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  state: State;

  @ApiProperty({
    description: 'Тип политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  type: Type;

  @ApiProperty({
    description: 'Дата активации политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  dateActive: Date;

  @ApiProperty({
    description: 'Контент политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  content: string;

  @ApiProperty({
    description: 'Дата создания политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления политики',
    example: 'bb1897ad-1e87-4747-a6bb-749e4bf49bf6',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Связанный пост политики',
    example: ['bb1897ad-1e87-4747-a6bb-749e4bf49bf6'],
    nullable: true,
  })
  posts: Post[];

  @ApiProperty({ description: 'Связанная организация с политикой' })
  organization: Organization;

  @ApiProperty({ description: 'Связанный юзер политики' })
  user: User;

  @ApiProperty({ description: 'Связанный аккаунт политики' })
  account: Account;


  @ApiProperty({ description: 'Связанные папки с политикой' })
  policyToPolicyDirectories: PolicyToPolicyDirectory[];
}

// id: "bb1897ad-1e87-4747-a6bb-749e4bf49bf6",
// policyName: "asdasd",
// policyNumber: 1,
// state: "Черновик",
// type: "Директива",
// dateActive: null,
// content: "string",
// createdAt: "2024-09-18T14:59:47.010Z",
// updatedAt: "2024-09-18T14:59:47.010Z"
