import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
// import { ConvertToUserCreateDto } from "../convertToUser/create-convertToUser.dto";

export class ConvertUpdateDto {
  @ApiProperty({
    description: 'Id обновляемого конверта',
    required: true,
    example: '27b360b3-7caf-48bd-a91a-5f7adef327de',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Id конверта не может быть пустым!' })
  _id: string;

  @ApiProperty({
    description: 'Список ids постов, которые участники',
    required: false,
    example: ['323e4567-e89b-12d3-a456-426614174000', '750e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty({ message: 'Массив наблюдателей не может быть пустым!' })
  convertToPostIds?: string[];

  @ApiProperty({
    description: 'Id активного поста',
    required: false,
    example: '27b360b3-7caf-48bd-a91a-5f7adef327de',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({ message: 'Id конверта не может быть пустым!' })
  activePostId?: string;


  @ApiProperty({
    description: 'Список ids постов, которые наблюдатели',
    required: false,
    example: ['323e4567-e89b-12d3-a456-426614174000', '750e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ message: 'Массив наблюдателей не может быть пустым!' })
  watcherIds?: string[];

  @ApiProperty({
    description: 'Статус завершения конверта',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  convertStatus?: boolean;
}
