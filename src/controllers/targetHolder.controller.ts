import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TargetHolderService } from 'src/application/services/targetHolder/targetHolder.service';
import { TargetHolderReadDto } from 'src/contracts/targetHolder/read-targetHolder.dto';

@ApiTags('TargetHolder')
@Controller(':userId/targetHolders')
export class TargetHolderController {
  constructor(private readonly targetHolderService: TargetHolderService) {}

  @Get()
  @ApiOperation({ summary: 'Все ответственные за задачи' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: [
      {
        id: '83125d91-1c31-4f6e-8443-15ea9c5d9f9d',
        target: {
          id: '7a269e8f-26ba-46da-9ef9-e1b17475b6d9',
          type: 'Продукт',
          commonNumber: null,
          statisticNumber: null,
          ruleNumber: null,
          productNumber: 1,
          content: 'Контент задачи',
          dateStart: '2024-09-20T14:44:44.274Z',
          deadline: '2024-09-27T14:59:47.010Z',
          dateComplete: null,
          createdAt: '2024-09-20T14:44:44.980Z',
          updatedAt: '2024-09-20T14:44:44.980Z',
        },
        user: {
          id: 'bc807845-08a8-423e-9976-4f60df183ae2',
          firstName: 'Maxik',
          lastName: 'Koval',
          telegramId: 453120600,
          telephoneNumber: null,
          avatar_url: null,
          vk_id: null,
          createdAt: '2024-09-16T14:03:31.000Z',
          updatedAt: '2024-09-16T14:03:31.000Z',
        },
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id пользователя',
    example: 'bc807845-08a8-423e-9976-4f60df183ae2',
  })
  async findAll(@Param() userId: string): Promise<TargetHolderReadDto[]> {
    return await this.targetHolderService.findAll();
  }
}
