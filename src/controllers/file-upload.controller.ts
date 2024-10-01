import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Req } from '@nestjs/common';
import { FileUploadService } from '../application/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/application/services/file/file.service';
import { PolicyService } from 'src/application/services/policy/policy.service';
import { FileCreateDto } from 'src/contracts/file-upload/create-file.dto';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService,
    private readonly fileService: FileService,
    private readonly policyService: PolicyService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
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
