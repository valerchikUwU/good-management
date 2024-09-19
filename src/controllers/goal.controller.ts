import { Controller, Get, Post, HttpStatus, Param, Body } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GoalService } from "src/application/services/goal/goal.service";
import { OrganizationService } from "src/application/services/organization/organization.service";
import { UsersService } from "src/application/services/users/users.service";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { Goal } from "src/domains/goal.entity";



@ApiTags('Goal')
@Controller(':userId/goals')
export class GoalController {
    constructor(private readonly goalService: GoalService,
        private readonly userService: UsersService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Все цели' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async findAll(@Param('userId') userId: string): Promise<GoalReadDto[]> {
        const user = await this.userService.findOne(userId);
        return await this.goalService.findAllForAccount(user.account)
    }


    @Get(':goalId')
    @ApiOperation({ summary: 'Получить цель по ID' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    @ApiParam({ name: 'goalId', required: true, description: 'Id цели' })
    async findOne(@Param('userId') userId: string, goalId: string): Promise<{ currentGoal: GoalReadDto, allGoals: GoalReadDto[] }> {
        const goal = await this.goalService.findeOneById(goalId);
        const user = await this.userService.findOne(userId)
        const allGoals = await this.goalService.findAllForAccount(user.account);

        return { currentGoal: goal, allGoals: allGoals };
    }




    @Post('new')
    @ApiOperation({ summary: 'Создать цель' })
    @ApiBody({
        description: 'ДТО для создания цели',
        type: GoalCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
            id: "f23c5846-f69d-4553-84a6-9d5f4a176e9d",
            goalName: "Стать пердуном №1",
            orderNumber: 1,
            content: "Надо перепукать шмата",
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
            createdAt: "2024-09-17T09:25:52.964Z",
            updatedAt: "2024-09-17T09:25:52.964Z"
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя' })
    async create(@Param('userId') userId: string, @Body() goalCreateDto: GoalCreateDto): Promise<Goal> {
        const user = await this.userService.findOne(userId);
        goalCreateDto.user = user;
        goalCreateDto.account = user.account;
        return await this.goalService.create(goalCreateDto);
    }

}