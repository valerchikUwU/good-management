import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { GraphType, PanelType } from "src/domains/controlPanel.entity";
import { Organization } from "src/domains/organization.entity";
import { Post } from "src/domains/post.entity";


/**
 * DTO для создания данных панели управления.
 */
export class ControlPanelCreateDto {
    @ApiProperty({
        description: 'Название панели',
        default: 'Панель №',
        required: false,
        example: 'Панель новая',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Название панели не может быть пустым!' })
    panelName?: string;

    @ApiProperty({
        description: 'Порядковый номер панели (минимум 1)',
        required: true,
        example: 1,
    })
    @IsNumber()
    @Min(1)
    orderNumber: number;

    @ApiProperty({
        description: 'Тип панели',
        required: false,
        default: PanelType.LOCAL,
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
        default: GraphType.DAY,
        example: 'Ежегодовой',
        examples: ['13', '26', '52', 'Ежемесячный', 'Ежедневный', 'Ежегодовой'],
    })
    @IsOptional()
    @IsEnum(GraphType)
    @IsNotEmpty({ message: 'Выберите тип отображения графика!' })
    graphType?: GraphType;

    @ApiProperty({
        description: 'IDs статистик, которые связать с панелью',
        required: true,
        example: ['05339d16-b595-4344-9b3b-2c67ed649830'],
    })
    @IsOptional()
    @IsArray({ message: 'Список Ids статистик должен быть массивом' })
    statisticIds?: string[];

    @ApiProperty({
        description: 'ID организации, с которой связать панель',
        required: true,
        example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
    })
    @IsUUID()
    @IsNotEmpty({ message: 'ID организации не может быть пустой!' })
    organizationId: string;

    @ApiProperty({
        description: 'ID поста создателя',
        required: true,
        example: '16ee6c67-0cc9-4d08-8622-7b50c4c7f45c',
    })
    @IsOptional()
    @IsUUID()
    @IsNotEmpty({ message: 'ID поста не может быть пустой!' })
    postId?: string;

    @Exclude({ toPlainOnly: true })
    organization: Organization;

    @Exclude({ toPlainOnly: true })
    post: Post;
}
