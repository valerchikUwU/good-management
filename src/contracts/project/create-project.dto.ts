import { Account } from 'src/domains/account.entity';
import { Type as TypeProject } from 'src/domains/project.entity';
import { Strategy } from 'src/domains/strategy.entity';
import { User } from 'src/domains/user.entity';
import { TargetCreateDto } from '../target/create-target.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Organization } from 'src/domains/organization.entity';
import {
  HasProductAndRegularTasksForProject,
  HasProductTaskAndProjectIdsForProgram,
  HasStrategyForProgram,
} from 'src/validators/project-validator';

export class ProjectCreateDto {
  @ApiProperty({
    description: 'Название проекта',
    required: true,
    example: 'Название проекта',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название проекта не может быть пустым!' })
  projectName: string;

  @ApiProperty({
    description: 'Id программы',
    required: false,
    example: 'b6ed2664-9510-4a47-9117-6ce89903b4b5',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({ message: 'ID программы не может быть пустым!' })
  programId?: string;

  @ApiProperty({
    description: 'Содержание проекта',
    required: false,
    example: 'Контент проекта',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Проект не может быть пустым!' })
  content?: string;

  @ApiProperty({
    description: 'Тип проекта',
    required: false,
    default: TypeProject.PROJECT,
    example: 'Проект',
    examples: ['Проект', 'Программа'],
  })
  @IsOptional()
  @IsEnum(TypeProject)
  @IsNotEmpty({ message: 'Выберите тип проекта!' })
  type?: TypeProject; //default project

  @ApiProperty({
    description: 'ID организации, которую связать с проектом',
    example: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Выберите организацию!' })
  organizationId: string;

  @ApiProperty({
    description: 'Id стратегии',
    required: false,
    example: 'd5eaa436-f93f-4743-854a-6f10a5d290a1',
  })  
  @HasStrategyForProgram({
    message:
      'Для программы обязательно нужно выбрать стратегию!',
  })
  strategyId?: string;

  @Exclude({ toPlainOnly: true })
  strategy: Strategy; // nullable

  @Exclude({ toPlainOnly: true })
  account: Account;

  @Exclude({ toPlainOnly: true })
  organization: Organization;

  @Exclude({ toPlainOnly: true })
  user: User;

  @ApiProperty({
    description: 'Список задач',
    required: false,
    example: [
      {
        type: 'Продукт',
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: '2024-09-18T14:59:47.010Z',
        deadline: '2024-09-18T14:59:47.010Z',
      },
      {
        type: 'Обычная',
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: '2024-09-18T14:59:47.010Z',
        deadline: '2024-09-18T14:59:47.010Z',
      },
      {
        type: 'Правила',
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: '2024-09-18T14:59:47.010Z',
        deadline: '2024-09-18T14:59:47.010Z',
      },
      {
        type: 'Статистика',
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: '2024-09-18T14:59:47.010Z',
        deadline: '2024-09-18T14:59:47.010Z',
      },
      {
        type: 'Организационные мероприятия',
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: '2024-09-18T14:59:47.010Z',
        deadline: '2024-09-18T14:59:47.010Z',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Должен быть массив!' })
  @ValidateNested()
  @Type(() => TargetCreateDto)
  @HasProductAndRegularTasksForProject({
    message:
      'Список задач должен содержать хотя бы одну задачу с типом "Продукт" и одну с типом "Обычная".',
  })
  targetCreateDtos?: TargetCreateDto[];

  @ApiProperty({
    description: 'IDs проектов, которые привязать с програмой',
    example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'],
  })
  @IsOptional()
  @IsArray()
  @HasProductTaskAndProjectIdsForProgram({
    message:
      'Для программы список задач должен содержать хотя бы одну задачу с типом "Продукт", также выберите хотя бы один проект для программы!',
  })
  projectIds?: string[];
}

// не может быть активным пока нет 1 задачи "продукт" и 1 задачи "обычная"
