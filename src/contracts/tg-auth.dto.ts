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
  }