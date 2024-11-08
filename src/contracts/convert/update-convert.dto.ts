import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";
// import { ConvertToUserCreateDto } from "../convertToUser/create-convertToUser.dto";


export class ConvertUpdateDto{
    @IsUUID()
    _id: string
    @IsArray()
    userIds?: string[];
    @IsArray()
    pathOfPosts?: string[];
    @IsUUID()
    activeUserId?: string;


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
}