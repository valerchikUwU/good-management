import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class AuthTG {

    @ApiProperty({description: 'Уникальный код от ВК'})
    @IsString()
    telephoneNumber: string;
    
    @ApiProperty({description: 'Фингерпринт браузера клиента'})
    @IsNumber()
    telegramId: number;

    @ApiProperty({description: 'Уникальный код от ВК'})
    @IsString()
    clientId: string;
    
    @ApiProperty({description: 'Фингерпринт браузера клиента'})
    @IsString()
    token: string;

    @ApiProperty({description: 'Флаг для создания пользователя'})
    @IsOptional()
    @IsBoolean()
    createUserFlag?: boolean;

    @ApiProperty({description: 'Имя юзера, если он логиниться через тг первый раз'})
    @IsOptional()
    @IsString()
    firstName?: string;
    
    @ApiProperty({description: 'Фамилия юзера, если он логиниться через тг первый раз'})
    @IsOptional()
    @IsString()
    lastName?: string;

  }