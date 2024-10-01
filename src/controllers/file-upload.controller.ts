import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Req, HttpStatus } from '@nestjs/common';
import { FileUploadService } from '../application/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/application/services/file/file.service';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { FileCreateDto } from 'src/contracts/file-upload/create-file.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller(':userId/file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService,
    private readonly fileService: FileService,
    private readonly policyService: PolicyService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить файл' })
  @ApiResponse({
      status: HttpStatus.OK, description: "ОК!",
      example: {
        }
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Ошибка валидации!" })
  @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
  @ApiQuery({ name: 'policyId', required: true, description: 'Id политики' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('policyId') policyId: string) {
    const policy = await this.policyService.findOneById(policyId);
    const fileCreateDto: FileCreateDto = {
      fileName: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      policy: policy
    }
    await this.fileService.create(fileCreateDto)
    return this.fileUploadService.handleFileUpload(file);
  }
}
