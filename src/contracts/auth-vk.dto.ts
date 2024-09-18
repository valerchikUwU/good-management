import { ApiProperty } from "@nestjs/swagger";

export class AuthVK {

    @ApiProperty({description: 'Уникальный код от ВК'})
    code: string;
    
    @ApiProperty({description: 'Фингерпринт браузера клиента'})
    fingerprint: string;
  }