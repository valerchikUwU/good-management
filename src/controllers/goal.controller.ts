import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Param,
  Body,
  Patch,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoalService } from 'src/application/services/goal/goal.service';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { UsersService } from 'src/application/services/users/users.service';
import { GoalCreateDto } from 'src/contracts/goal/create-goal.dto';
import { GoalReadDto } from 'src/contracts/goal/read-goal.dto';
import { GoalUpdateDto } from 'src/contracts/goal/update-goal.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { ProducerService } from 'src/application/services/producer/producer.service';
import { GoalCreateEventDto } from 'src/contracts/goal/createEvent-goal.dto';
import { GoalUpdateEventDto } from 'src/contracts/goal/updateEvent-goal.dto';
import { TimeoutError } from 'rxjs';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request as ExpressRequest } from 'express';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';


@UseGuards(AccessTokenGuard)
@ApiTags('Goal')
@ApiBearerAuth('access-token') // Указывает использовать схему Bearer
@Controller('goals')
export class GoalController {
  constructor(
    private readonly goalService: GoalService,
    private readonly organizationService: OrganizationService,
    private readonly producerService: ProducerService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Get(':organizationId')
  @ApiOperation({ summary: 'Цель организации' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {
      "id": "d2845ccb-c4c3-4ddc-90f5-7a840160cef0",
      "content": [
        "333333",
        "1",
        "2\n",
        "4"
      ],
      "createdAt": "2024-12-04T16:06:47.420Z",
      "updatedAt": "2024-12-19T09:38:11.150Z"
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'Id организации',
    example: '2d1cea4c-7cea-4811-8cd5-078da7f20167',
  })
  async findAll(
    @Param('organizationId') organizationId: string
  ): Promise<GoalReadDto> {
    const goal = await this.goalService.findOneByOrganizationId(organizationId)
    return goal;
  }

  // @Get('new')
  // @ApiOperation({ summary: 'Получить данные для создания новой цели' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'ОК!',
  //   example: [
  //     {
  //       id: 'be720b9e-873b-4d4e-a866-b3c598878863',
  //       organizationName: 'Ласка и Выдрочка',
  //       parentOrganizationId: null,
  //       createdAt: '2024-10-11T13:21:24.898Z',
  //       updatedAt: '2024-10-11T13:21:24.898Z',
  //       goal: null,
  //     },
  //     {
  //       id: 'b1294a99-ec8d-4e62-8345-45da2d89b6b9',
  //       organizationName: 'Светлоярский и Ко',
  //       parentOrganizationId: null,
  //       createdAt: '2024-10-11T13:22:01.835Z',
  //       updatedAt: '2024-10-11T13:22:01.835Z',
  //       goal: null,
  //     },
  //   ],
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: 'Ошибка сервера!',
  // })
  // @ApiParam({
  //   name: 'userId',
  //   required: true,
  //   description: 'Id пользователя',
  //   example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  // })
  // async beforeCreate(
  //   @Param('userId') userId: string,
  //   @Ip() ip: string,
  // ): Promise<OrganizationReadDto[]> {
  //   const user = await this.userService.findOne(userId, ['account']);
  //   const organizations =
  //     await this.organizationService.findAllWithoutGoalsForAccount(
  //       user.account,
  //     );
  //   return organizations;
  // }

  @Patch(':goalId/update')
  @ApiOperation({ summary: 'Обновить цель по ID' })
  @ApiBody({
    description: 'ДТО для обновления цели',
    type: GoalUpdateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {"id": "7468bad1-a4b4-4600-8ac8-098f3e865b11"}
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Цель не найдена!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({ 
    name: 'goalId', required: true, description: 'Id цели' 
  })
  async update(
    @Req() req: ExpressRequest,
    @Param('goalId') goalId: string,
    @Body() goalUpdateDto: GoalUpdateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const updatedGoalId = await this.goalService.update(goalId, goalUpdateDto);
    const updateEventGoalDto: GoalUpdateEventDto = {
      eventType: 'GOAL_UPDATED',
      id: updatedGoalId,
      content: goalUpdateDto.content,
      updatedAt: new Date(),
      accountId: user.account.id,
    };
    try {
      await Promise.race([
        this.producerService.sendUpdatedGoalToQueue(updateEventGoalDto),
        new Promise((_, reject) =>
          setTimeout(() => reject(new TimeoutError()), 5000),
        ),
      ]);
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error(
          `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
        );
      } else {
        this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
      }
    }
    this.logger.info(
      `${yellow('OK!')} - UPDATED GOAL: ${JSON.stringify(goalUpdateDto)} - Цель успешно обновлена!`,
    );
    return { id: updatedGoalId };
  }

  // @Get(':goalId')
  // @ApiOperation({ summary: 'Получить цель по ID' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'ОК!',
  //   example: {
  //     currentGoal: {
  //       id: '1997ef07-7b59-4496-b91d-be440468f9be',
  //       content: ['Контент цели', 'one more content'],
  //       createdAt: '2024-10-10T15:22:39.611Z',
  //       updatedAt: '2024-10-10T15:22:39.611Z',
  //       organization: {
  //         id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
  //         organizationName: 'soplya firma',
  //         parentOrganizationId: null,
  //         createdAt: '2024-09-16T14:24:33.841Z',
  //         updatedAt: '2024-09-16T14:24:33.841Z',
  //       },
  //     },
  //     organizations: [
  //       {
  //         id: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
  //         organizationName: 'soplya firma',
  //         parentOrganizationId: null,
  //         createdAt: '2024-09-16T14:24:33.841Z',
  //         updatedAt: '2024-09-16T14:24:33.841Z',
  //       },
  //       {
  //         id: '1f1cca9a-2633-489c-8f16-cddd411ff2d0',
  //         organizationName: 'OOO BOBRIK',
  //         parentOrganizationId: '865a8a3f-8197-41ee-b4cf-ba432d7fd51f',
  //         createdAt: '2024-09-16T15:09:48.995Z',
  //         updatedAt: '2024-09-16T15:09:48.995Z',
  //       },
  //     ],
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: 'Ошибка сервера!',
  // })
  // @ApiParam({
  //   name: 'userId',
  //   required: true,
  //   description: 'Id пользователя',
  //   example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  // })
  // @ApiParam({ name: 'goalId', required: true, description: 'Id цели' })
  // async findOne(
  //   @Param('userId') userId: string,
  //   @Param('goalId') goalId: string,
  //   @Ip() ip: string,
  // ): Promise<{
  //   currentGoal: GoalReadDto;
  //   organizations: OrganizationReadDto[];
  // }> {
  //   const user = await this.userService.findOne(userId, ['account']);
  //   const goal = await this.goalService.findOneById(goalId, [
  //     'user',
  //     'organization',
  //   ]);
  //   const organizations =
  //     await this.organizationService.findAllWithGoalsForAccount(user.account);
  //   this.logger.info(
  //     `${yellow('OK!')} - ${red(ip)} - CURRENT GOAL: ${JSON.stringify(goal)} - Получить цель по ID!`,
  //   );
  //   return { currentGoal: goal, organizations: organizations };
  // }

  @Post('new')
  @ApiOperation({ summary: 'Создать цель' })
  @ApiBody({
    description: 'ДТО для создания цели',
    type: GoalCreateDto,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ОК!',
    example: {"id": "da1787cb-a79a-4663-8232-c13cacfdb953"},
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ошибка валидации!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы не авторизованы!',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async create(
    @Req() req: ExpressRequest,
    @Body() goalCreateDto: GoalCreateDto,
  ): Promise<{ id: string }> {
    const user = req.user as ReadUserDto;
    const organization = await this.organizationService.findOneById(goalCreateDto.organizationId);
    goalCreateDto.user = user;
    goalCreateDto.account = user.account;
    goalCreateDto.organization = organization;
    const createdGoalId = await this.goalService.create(goalCreateDto);
    const createEventGoalDto: GoalCreateEventDto = {
      eventType: 'GOAL_CREATED',
      id: createdGoalId,
      content: goalCreateDto.content,
      createdAt: new Date(),
      organizationId: goalCreateDto.organizationId,
      userId: user.id,
      accountId: user.account.id,
    };
    try {
      await Promise.race([
        this.producerService.sendCreatedGoalToQueue(createEventGoalDto),
        new Promise((_, reject) =>
          setTimeout(() => reject(new TimeoutError()), 5000),
        ),
      ]);
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error(
          `Ошибка отправки в RabbitMQ: превышено время ожидания - ${error.message}`,
        );
      } else {
        this.logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
      }
    }
    this.logger.info(
      `${yellow('OK!')} - goalCreateDto: ${JSON.stringify(goalCreateDto)} - Создана новая цель!`,
    );
    return { id: createdGoalId };
  }
}
