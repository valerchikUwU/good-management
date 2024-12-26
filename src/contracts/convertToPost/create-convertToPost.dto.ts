// import { ApiProperty } from "@nestjs/swagger";
// import { IsEnum, IsUUID } from "class-validator";
// import { UserType } from "src/domains/convertToUser.entity";

// export class ConvertToUserCreateDto {

//     @ApiProperty({description: 'Тип пользователя в конверте', required: true, example: 'Наблюдатель', examples: ['Наблюдатель', 'Отправитель', 'Получатель'] })
//     @IsEnum(UserType)
//     userType: UserType;

//     @ApiProperty({description: 'Ids юзеров, которых добавить в конверт', required: true, example: ['b0ed9226-cf25-4d25-86c5-4708da4e060a', '1db61b0d-766b-4a1a-8927-f97b2a3cd445'] })
//     @IsUUID()
//     userId: string;
// }
