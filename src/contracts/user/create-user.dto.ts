import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Account } from 'src/domains/account.entity';
import { Role } from 'src/domains/role.entity';

export class CreateUserDto {

  @ApiProperty({ description: 'ID юзера', required: true, example: '675a797e-d0f2-4907-bad5-25733c3e2380' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Имя юзера', required: true, example: 'Максик' })
  @IsString()
  @IsNotEmpty()
  firstName: string;


  @ApiProperty({ description: 'Фамилия юзера', required: true, example: 'Ковальский' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Отчество юзера', required: true, example: 'Тимофеевич' })
  @IsString()
  @IsNotEmpty()
  middleName: string;

  @ApiProperty({ description: 'Номер телефона', required: true, example: '+79787878778' })
  @IsString()
  @IsNotEmpty()
  telephoneNumber: string;


  @ApiProperty({ description: 'ID роли', required: true, example: '675a797e-d0f2-4907-bad5-25733c3e2380' })
  @IsUUID()
  roleId?: string;

  @Exclude({ toPlainOnly: true })
  role: Role;

  @Exclude({ toPlainOnly: true })
  account: Account

}

// add middlename