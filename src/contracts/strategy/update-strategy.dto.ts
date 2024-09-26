import { ApiProperty } from "@nestjs/swagger";
import { State } from "src/domains/strategy.entity";

export class StrategyUpdateDto{

    
    @ApiProperty({description: 'Id стратегии', example: '21dcf96d-1e6a-4c8c-bc12-c90589b40e93'})
    _id: string;

    @ApiProperty({required: false, description: 'Состояние стратегии', example: 'Черновик', examples: ['Черновик', 'Активный', 'Завершено'] })
    state?: State;

    @ApiProperty({description: 'Название стратегии', example: 'Название'})
    strategyName?: string;

    @ApiProperty({description: 'Контент стратегии', example: 'Контент'})
    content?: string;

    @ApiProperty({ description:'ID организаций, с которыми связать стратегию', example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f']})
    strategyToOrganizations?: string[];
}