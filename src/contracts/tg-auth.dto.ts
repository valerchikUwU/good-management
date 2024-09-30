import { ApiProperty } from "@nestjs/swagger";

export class AuthTG {

    @ApiProperty({description: 'Уникальный код от ВК'})
    telephoneNumber: string;
    
    @ApiProperty({description: 'Фингерпринт браузера клиента'})
    telegramId: number;

    @ApiProperty({description: 'Уникальный код от ВК'})
    clientId: string;
    
    @ApiProperty({description: 'Фингерпринт браузера клиента'})
    token: string;

    @ApiProperty({description: 'Флаг для создания пользователя'})
    createUserFlag: boolean;

    @ApiProperty({description: 'Имя юзера, если он логиниться через тг первый раз'})
    firstName?: string;
    
    @ApiProperty({description: 'Фамилия юзера, если он логиниться через тг первый раз'})
    lastName?: string;

  }