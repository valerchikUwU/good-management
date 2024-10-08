import { ApiProperty } from "@nestjs/swagger";

export class AuthVK {

    @ApiProperty({description: 'Авторизационный код от ВК'})
    code: string;
    
    @ApiProperty({description: 'Фингерпринт браузера клиента'})
    fingerprint: string;

    @ApiProperty({description: 'Верификатор, который обеспечивает защиту передаваемых данных.'})
    code_verifier: string;

    @ApiProperty({description: 'Уникальный идентификатор устройства, полученный вместе с авторизационным кодом'})
    device_id: string;

    @ApiProperty({description: 'Строка состояния в виде случайной строки'})
    state: string;
  }