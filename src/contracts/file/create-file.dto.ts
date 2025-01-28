import { ApiProperty } from '@nestjs/swagger';

export class FileCreateDto {
  @ApiProperty({
    description: 'Название файла',
    required: true,
    example: 'Галя_nudes.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'Путь к файлу',
    required: true,
    example: 'uploads/1737988764326-photo_2022-03-13_23-16-33.jpg',
  })
  path: string;

  @ApiProperty({
    description: 'Размер файла',
    required: true,
    example: 345561,
  })
  size: number;

  @ApiProperty({
    description: 'Расширение файла',
    required: true,
    example: 'image/jpeg',
  })
  mimetype: string;
}
