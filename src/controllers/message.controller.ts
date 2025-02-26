import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { MessageService } from 'src/application/services/message/message.service';
import { findAllConvertsExample, findOneConvertExample } from 'src/constants/swagger-examples/convert/convert-examples';
import { MessageReadDto } from 'src/contracts/message/read-message.dto';
import { findAllMessagesForConvertExample } from 'src/constants/swagger-examples/message/message-example';
import { CustomParseIntPipe } from 'src/validators/pipes/customParseIntPipe';
import { Request as ExpressRequest } from 'express'
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { ConvertGateway } from 'src/gateways/convert.gateway';

@ApiTags('Messages')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('messages')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly convertService: ConvertService,
        private readonly convertGateway: ConvertGateway,
        @Inject('winston') private readonly logger: Logger,
    ) { }

    @Get(':convertId')
    @ApiOperation({ summary: 'Все сообщения в чате с пагинацией' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'ОК!',
        example: findAllMessagesForConvertExample
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Ошибка сервера!',
    })
    @ApiParam({
        name: 'convertId',
        required: true,
        description: 'Id конверта',
        example: 'bdebb8ec-2a05-477c-93a8-463f60f3d2b5',
    })
    @ApiQuery({
        name: 'pagination',
        required: false,
        description: 'Отступ пагинации',
        example: 120,
    })
    async findAllForConvert(
        @Param('convertId') convertId: string, @Query('pagination', CustomParseIntPipe) pagination: number): Promise<MessageReadDto[]> {
        let start = new Date()
        console.log(pagination)
        const messages = await this.messageService.findAllForConvert(convertId, pagination, ['attachmentToMessages.attachment', 'sender.user']);
        let c = new Date()
        let end = c.getTime() - start.getTime()
        console.log(end)
        return messages;
    }


    @Post(':convertId/sendMessage')
    @ApiOperation({ summary: 'Отправить сообщение' })
    @ApiBody({
        description: 'ДТО для создания сообщения',
        type: MessageCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'ОК!',
        example: {
            id: '27b360b3-7caf-48bd-a91a-5f7adef327de',
        },
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Ошибка сервера!',
    })
    async sendMessage(
        @Req() req: ExpressRequest,
        @Param('convertId') convertId: string,
        @Body() messageCreateDto: MessageCreateDto
    ): Promise<{ id: string }> {
        const user = req.user as ReadUserDto;
        const userSenderPost = user.posts.find(post => post.id === messageCreateDto.postId)
        const convert = await this.convertService.findOneById(convertId, ['convertToPosts.post.user']);
        const postIdsInConvert = convert.convertToPosts.map(convertToPost => {
            if (convertToPost.post.id !== userSenderPost.id)
                return convertToPost.post.user.id
        });
        const userIdsInConvert = convert.convertToPosts.map(convertToPost => {
            if (convertToPost.post.user && convertToPost.post.user.id !== user.id)
                return convertToPost.post.user.id
        });
        messageCreateDto.convert = convert;
        messageCreateDto.sender = userSenderPost;
        const createdMessage = await this.messageService.create(messageCreateDto);
        this.convertGateway.handleMessageCreationEvent(convertId, createdMessage);
        this.convertGateway.handleMessageCountEvent(convertId, userIdsInConvert, postIdsInConvert);
        this.logger.info(
            `${yellow('OK!')} - messageCreateDto: ${JSON.stringify(messageCreateDto)} - Создано новое сообщение!`,
        );
        return { id: createdMessage.id };
    }
}