import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Account } from "src/domains/account.entity";
import { PolicyToPolicyDirectory } from "src/domains/policyToPolicyDirectories.entity";

export class PolicyDirectoryUpdateDto{

    @ApiProperty({description: 'Название папки', required: false, example: 'Папка политик для отдела продаж'})
    @IsOptional()
    @IsString()
    @IsNotEmpty({message: 'Название папки не может быть пустым!'})
    directoryName?: string;

    @ApiProperty({description: 'Ids политик, которые добавить в папку', required: false})
    @IsOptional()
    @IsArray({message: 'Должен быть массив!'})
    @ArrayNotEmpty({message: 'Выберите хотя бы одну политику!'})
    policyToPolicyDirectories?: string[]

}
