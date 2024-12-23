import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileUploadService } from '../application/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/application/services/file/file.service';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { FileCreateDto } from 'src/contracts/file-upload/create-file.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@ApiTags('File')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly fileService: FileService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить файл' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {},
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileCreateDto: FileCreateDto = {
      fileName: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    };
    await this.fileService.create(fileCreateDto);
    return this.fileUploadService.handleFileUpload(file);
  }
}
