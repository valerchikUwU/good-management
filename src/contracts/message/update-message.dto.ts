import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class MessageUpdateDto {
  @ApiProperty({
    description: 'Id обновляемого сообщения',
    required: true,
    example: '1c509c6d-aba9-41c1-8b04-dd196d0af0c7',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Id сообщения не може быть пустым!' })
  _id: string;

  @ApiProperty({
    description: 'Текст сообщения',
    required: true,
    example: 'Прывит',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Время прочтения',
    required: false,
    example: '2024-12-04 15:42:13.933625',
  })
  @IsOptional()
  @IsDate()
  timeSeen?: Date;
}
