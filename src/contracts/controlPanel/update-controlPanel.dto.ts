import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { GraphType, PanelType } from "src/domains/controlPanel.entity";
import { Organization } from "src/domains/organization.entity";


/**
 * DTO для создания данных панели управления.
 */
export class ControlPanelUpdateDto {
    @ApiProperty({
        description: 'Название панели',
        required: false,
        example: 'Панель новая',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: 'Длина названия панели не более 255 символов!' })
    @IsNotEmpty({ message: 'Название панели не может быть пустым!' })
    panelName?: string;


    @ApiProperty({
        description: 'Тип панели',
        required: false,
        example: 'Личная',
        examples: ['Личная', 'Глобальная'],
    })
    @IsOptional()
    @IsEnum(PanelType)
    @IsNotEmpty({ message: 'Выберите тип панели!' })
    panelType?: PanelType;


    @ApiProperty({
        description: 'Тип отображения графика',
        required: false,
        example: 'Ежедневный',
        examples: [
            GraphType.YEAR,
            GraphType.WEEK_13,
            GraphType.WEEK_26,
            GraphType.WEEK_52,
            GraphType.MONTH,
            GraphType.DAY
        ],
    })
    @IsOptional()
    @IsEnum(GraphType)
    @IsNotEmpty({ message: 'Выберите тип отображения графика!' })
    graphType?: GraphType;

    @ApiProperty({
        description: 'IDs статистик, которые связать с панелью',
        required: false,
        example: ['05339d16-b595-4344-9b3b-2c67ed649830'],
    })
    @IsOptional()
    @IsArray({ message: 'Список Ids статистик должен быть массивом' })
    statisticIds?: string[];

}
