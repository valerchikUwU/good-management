import { ApiProperty } from "@nestjs/swagger";
import { PolicyToPolicyDirectory } from "src/domains/policyToPolicyDirectories.entity";

export class PolicyDirectoryReadDto{
    @ApiProperty({description: 'Id папки'})
    id: string

    @ApiProperty({description: 'Название папки', example: 'Папка политик для отдела продаж'})
    directoryName: string;

    @ApiProperty({description: 'Связанные политики с папкой'})
    policyToPolicyDirectories: PolicyToPolicyDirectory[]
}
