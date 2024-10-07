import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { Strategy } from "src/domains/strategy.entity";



export class ObjectiveUpdateDto{

    @ApiProperty({ description: 'Id обновляемой краткосрочной цели', required: true, example: '1c509c6d-aba9-41c1-8b04-dd196d0af0c7' })
    @IsUUID()
    @IsNotEmpty()
    _id: string;

    @ApiProperty({ description: 'Ситуация', required: false, isArray: true, example: ['Ситуация'] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    situation?: string[];

    @ApiProperty({ description: 'Контент', required: false, isArray: true, example: ['Контент'] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    content?: string[];

    @ApiProperty({ description: 'Коренная причина', required: false, isArray: true, example: ['Коренная причина'] })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    rootCause?: string[];

    @ApiProperty({ description: 'Id стратегии', required: false, example: '21dcf96d-1e6a-4c8c-bc12-c90589b40e93' })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    strategyId?: string

    @Exclude({toPlainOnly: true})
    strategy: Strategy
}