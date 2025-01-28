import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/application/services/file/file.service';
import { FileCreateDto } from 'src/contracts/file-upload/create-file.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { FileValidationPipe } from 'src/validators/pipes/fileValidationPipe';

@ApiTags('File')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileService: FileService,
  ) { }

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
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<{ message: string, filePath: string }> {
    const fileCreateDto: FileCreateDto = {
      fileName: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    };
    const createdFile = await this.fileService.create(fileCreateDto);
    return { message: 'Файл успешно загружен!', filePath: createdFile.path };
  }
}
