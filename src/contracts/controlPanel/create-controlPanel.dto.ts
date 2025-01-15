import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { GraphType, PanelType } from "src/domains/controlPanel.entity";
import { Organization } from "src/domains/organization.entity";


/**
 * DTO для создания данных панели управления.
 */
export class ControlPanelCreateDto {
    @ApiProperty({
        description: 'Название панели',
        required: true,
        example: 'Панель новая',
    })
    @IsString()
    @IsNotEmpty({ message: 'Название панели не может быть пустым!' })
    panelName: string;


    @ApiProperty({
        description: 'Тип панели',
        required: true,
        default: PanelType.GLOBAL,
        example: 'Личная',
        examples: ['Личная', 'Глобальная'],
    })
    @IsEnum(PanelType)
    @IsNotEmpty({ message: 'Выберите тип панели!' })
    panelType: PanelType;


    @ApiProperty({
        description: 'Тип отображения графика',
        required: true,
        default: GraphType.DAY,
        example: 'Ежедневные',
        examples: ['13 недель', 'Месячные', 'Ежедневные'],
    })
    @IsEnum(GraphType)
    @IsNotEmpty({ message: 'Выберите тип отображения графика!' })
    graphType: GraphType;

    @ApiProperty({
        description: 'IDs статистик, которые связать с панелью',
        required: true,
        example: ['05339d16-b595-4344-9b3b-2c67ed649830'],
    })
    @IsArray({ message: 'Список Ids статистик должен быть массивом' })
    statisticIds: string[];

    @ApiProperty({
        description: 'ID организации, с которой связать панель',
        required: true,
        example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
    })
    @IsUUID()
    @IsNotEmpty({ message: 'ID организации не может быть пустой!' })
    organizationId: string;

    @Exclude({ toPlainOnly: true })
    organization: Organization;
}
