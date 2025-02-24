import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TargetHolderService } from 'src/application/services/targetHolder/targetHolder.service';
import { findAllTargetHoldersExample } from 'src/constants/swagger-examples/targetHolder/targetHolder-examples';
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
    example: findAllTargetHoldersExample
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
