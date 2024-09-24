import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsUUID } from "class-validator";
import { Account } from "src/domains/account.entity";
import { State, Type } from "src/domains/policy.entity";
import { User } from "src/domains/user.entity";


export class PolicyUpdateDto{

    @ApiProperty({ description: 'Id обновляемой политики', required: true, example: '0ba305e6-1d80-4ff6-a436-93d118f99993' })
    @IsUUID()
    _id: string
    
    @ApiProperty({ description: 'Название политики', required: false, example: 'Политика' })
    policyName?: string
    
    @ApiProperty({ description: 'Состояние политики', required: false, example: 'Черновик', examples: ['Черновик', 'Активный', 'Отменён'] })
    state?: State;
    
    @ApiProperty({ description: 'Тип политики', required: false, example: 'Директива', examples: ['Директива', 'Инструкция'] })
    type?: Type;
    
    @ApiProperty({ description: 'HTML контент политики', required: false, example: 'HTML контент (любая строка пройдет)' })
    content?: string;

    @ApiProperty({ description: 'IDs организаций, к которым привязать политику', required: false, example: ['865a8a3f-8197-41ee-b4cf-ba432d7fd51f'] })
    policyToOrganizations?: string[]
}