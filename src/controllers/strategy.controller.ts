import { Body, Controller, Get, HttpStatus, Param, Patch, Post } from "@nestjs/common";

import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyService } from "src/application/services/strategy/strategy.service";
import { StrategyCreateDto } from "src/contracts/strategy/create-strategy.dto";
import { UsersService } from "src/application/services/users/users.service";
import { Strategy } from "src/domains/strategy.entity";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { StrategyUpdateDto } from "src/contracts/strategy/update-strategy.dto";

@ApiTags('Strategy')
@Controller(':userId/strategies')
export class StrategyController {
    constructor(
        private readonly strategyService: StrategyService,
        private readonly userService: UsersService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все стратегии' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: [
            {
                id: "21dcf96d-1e6a-4c8c-bc12-c90589b40e93",
                strategyNumber: 2,
                strategyName: "Стратегия",
                dateActive: null,
                content: "HTML текст",
                state: "Черновик",
                createdAt: "2024-09-20T14:35:56.273Z",
                updatedAt: "2024-09-20T14:35:56.273Z"
            }
        ]
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findAll(@Param('userId') userId: string): Promise<StrategyReadDto[]> {
        const user = await this.userService.findOne(userId);
        return await this.strategyService.findAllForAccount(user.account)
    }


    @Patch(':strategyId/update')
    @ApiOperation({ summary: 'Обновить стратегию по Id' })
    @ApiBody({
        description: 'ДТО для обновления стратегии',
        type: StrategyUpdateDto,
        required: true,
    })
    @ApiResponse({
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    @ApiParam({ name: 'strategyId', required: true, description: 'Id политики' })
    async update(@Param('strategyId') strategyId: string, @Body() strategyUpdateDto: StrategyUpdateDto): Promise<StrategyReadDto>{
        return await this.strategyService.update(strategyId, strategyUpdateDto);
    }

    @Post('new')
    @ApiOperation({ summary: 'Создать стратегию' })
    @ApiBody({
        description: 'ДТО для создания цели',
        type: StrategyCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example:
        {
            strategyName: "Стратегия",
            content: "HTML текст",
            state: "Черновик",
            user: {
                id: "3b809c42-2824-46c1-9686-dd666403402a",
                firstName: "Maxik",
                lastName: "Koval",
                telegramId: 453120600,
                telephoneNumber: null,
                avatar_url: null,
                vk_id: null,
                createdAt: "2024-09-16T14:03:31.000Z",
                updatedAt: "2024-09-16T14:03:31.000Z",
                organization: {
                    id: "865a8a3f-8197-41ee-b4cf-ba432d7fd51f",
                    organizationName: "soplya firma",
                    parentOrganizationId: null,
                    createdAt: "2024-09-16T14:24:33.841Z",
                    updatedAt: "2024-09-16T14:24:33.841Z"
                },
                account: {
                    id: "a1118813-8985-465b-848e-9a78b1627f11",
                    accountName: "OOO PIPKA",
                    createdAt: "2024-09-16T12:53:29.593Z",
                    updatedAt: "2024-09-16T12:53:29.593Z"
                }
            },
            account: {
                id: "a1118813-8985-465b-848e-9a78b1627f11",
                accountName: "OOO PIPKA",
                createdAt: "2024-09-16T12:53:29.593Z",
                updatedAt: "2024-09-16T12:53:29.593Z"
            },
            dateActive: null,
            id: "21dcf96d-1e6a-4c8c-bc12-c90589b40e93",
            strategyNumber: 2,
            createdAt: "2024-09-20T14:35:56.273Z",
            updatedAt: "2024-09-20T14:35:56.273Z"
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async create(@Param('userId') userId: string, @Body() strategyCreateDto: StrategyCreateDto): Promise<Strategy> {
        const user = await this.userService.findOne(userId);
        strategyCreateDto.user = user;
        strategyCreateDto.account = user.account
        return await this.strategyService.create(strategyCreateDto)
    }
}