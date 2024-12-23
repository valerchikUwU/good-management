import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthTG {
  @ApiProperty({ description: 'Номер телефона' })
  @IsString()
  telephoneNumber: string;

  @ApiProperty({ description: 'Телеграм id' })
  @IsNumber()
  telegramId: number;

  @ApiProperty({ description: 'Id сокета клиента' })
  @IsString()
  clientId: string;

  @ApiProperty({ description: 'Токен логина' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Флаг для создания пользователя' })
  @IsOptional()
  @IsBoolean()
  createUserFlag?: boolean;

  @ApiProperty({
    description: 'Имя юзера, если он логиниться через тг первый раз',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Фамилия юзера, если он логиниться через тг первый раз',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
