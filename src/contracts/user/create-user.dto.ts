import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Account } from 'src/domains/account.entity';
import { Role } from 'src/domains/role.entity';
import { RoleSettingReadDto } from '../roleSetting/read-roleSetting.dto';

export class CreateUserDto {


  @ApiProperty({ description: 'Имя юзера', required: true, example: 'Максик' })
  @IsString()
  @IsNotEmpty()
  firstName: string;


  @ApiProperty({ description: 'Фамилия юзера', required: true, example: 'Ковальский' })
  @IsString()
  @IsNotEmpty()
  lastName: string;


  @ApiProperty({ description: 'Номер телефона', required: true, example: '+79787878778' })
  @IsString()
  @IsOptional()
  telephoneNumber: string | null;


  @ApiProperty({ description: 'ID роли', required: true, example: '675a797e-d0f2-4907-bad5-25733c3e2380' })
  @IsUUID()
  roleId: string;

  @Exclude({ toPlainOnly: true })
  role: Role;

  @Exclude({ toPlainOnly: true })
  account: Account

}