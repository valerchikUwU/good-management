import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Account } from 'src/domains/account.entity';
import { PolicyToPolicyDirectory } from 'src/domains/policyToPolicyDirectories.entity';

export class PolicyDirectoryCreateDto {
  @ApiProperty({
    description: 'Название папки',
    example: 'Папка политик для отдела продаж',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название папки не может быть пустым!' })
  directoryName: string;

  @ApiProperty({ description: 'Ids политик, которые добавить в папку' })
  @IsArray({ message: 'Должен быть массив!' })
  @ArrayNotEmpty({ message: 'Выберите хотя бы одну политику!' })
  policyToPolicyDirectories: string[];

  @Exclude({ toPlainOnly: true })
  account: Account;
}
