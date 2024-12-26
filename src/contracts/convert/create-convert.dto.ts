import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEAN,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Account } from 'src/domains/account.entity';
import { User } from 'src/domains/user.entity';
import { MessageCreateDto } from '../message/create-message.dto';
import { TypeConvert } from 'src/domains/convert.entity';
import { TargetCreateDto } from '../target/create-target.dto';
// import { ConvertToUserCreateDto } from "../convertToUser/create-convertToUser.dto";

export class ConvertCreateDto {
  @ApiProperty({ description: 'Тема конверта', example: 'Тема' })
  @IsString()
  @IsNotEmpty({ message: 'Тема не может быть пустой!' })
  convertTheme: string;

  @Exclude({ toPlainOnly: true })
  pathOfPosts: string[];

  @ApiProperty({
    description: 'Длительность конверта',
    example: 17828282828,
  })
  @IsString()
  @IsNotEmpty({ message: 'Длительность чата не может быть пустой!' })
  expirationTime: number;

  @ApiProperty({
    description: 'Тип конверта',
    example: TypeConvert.DIRECT,
    examples: [TypeConvert.DIRECT, TypeConvert.ORDER, TypeConvert.COORDINATION],
  })
  @IsEnum(TypeConvert)
  @IsNotEmpty({ message: 'Тип конверта не может быть пустой!' })
  convertType: TypeConvert;

  @ApiProperty({
    description: 'Дата окончания актуальности конверта',
    example: '2024-09-26T13:03:19.759Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Дата не может быть пустой!' })
  dateFinish: Date;

  // @ApiProperty({
  //     description: 'IDs участников чата и их тип', example:
  //     [
  //         {
  //             userType: 'Наблюдатель',
  //             userId: '3b809c42-2824-46c1-9686-dd666403402a'
  //         }
  //     ]
  // })
  // @IsArray({ message: 'Должен быть массив' })
  // @ArrayNotEmpty({ message: 'Добавьте хотя бы одного участника чата!' })
  // convertToUserCreateDtos: ConvertToUserCreateDto[];

  @Exclude({ toPlainOnly: true })
  host: User;

  @Exclude({ toPlainOnly: true })
  account: Account;


  @ApiProperty({
      description: 'Список задач',
      required: false,
      example: {
          type: 'Приказ',
          orderNumber: 1,
          content: 'Контент задачи',
          holderPostId: 'c92895e6-9496-4cb5-aa7b-e3c72c18934a',
          dateStart: '2024-09-18T14:59:47.010Z',
          deadline: '2024-09-18T14:59:47.010Z',
        }
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => TargetCreateDto)
    targetCreateDto?: TargetCreateDto;
}
