import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpStatus,
    Inject,
    Param,
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
import { MessageReadDto } from 'src/contracts/message/read-message.dto';
import { findSeenMessagesForConvertExample, findUnseenMessagesForConvertExample } from 'src/constants/swagger-examples/message/message-example';
import { CustomParseIntPipe } from 'src/validators/pipes/customParseIntPipe';
import { Request as ExpressRequest } from 'express'
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { ConvertService } from 'src/application/services/convert/convert.service';
import { ConvertGateway } from 'src/gateways/convert.gateway';
import { ConvertToPost } from 'src/domains/convertToPost.entity';

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

    @Get(':convertId/seen')
    @ApiOperation({ summary: 'Прочитанные сообщения и сообщения юзера в чате с пагинацией (отсортированы по createdAt DESC)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'ОК!',
        example: findSeenMessagesForConvertExample
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Вы не авторизованы!',
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
    async findSeenForConvert(
        @Req() req: ExpressRequest,
        @Param('convertId') convertId: string,
        @Query('pagination', CustomParseIntPipe) pagination: number
    ): Promise<MessageReadDto[]> {
        const user = req.user as ReadUserDto;
        const userPostIds = user.posts.map(post => post.id)
        const messages = await this.messageService.findSeenForConvert(convertId, pagination, userPostIds, ['attachmentToMessages.attachment', 'sender.user']);
        return messages;
    }

    @Get(':convertId/unseen')
    @ApiOperation({ summary: 'Непрочитанные сообщения в чате с пагинацией (отсортированы по createdAt DESC)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'ОК!',
        example: findUnseenMessagesForConvertExample
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Вы не авторизованы!',
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
    async findUnseenForConvert(
        @Req() req: ExpressRequest,
        @Param('convertId') convertId: string,
    ): Promise<MessageReadDto[]> {
        const start = new Date();
        const user = req.user as ReadUserDto;
        const userPostIds = user.posts.map(post => post.id)
        const messages = await this.messageService.findUnseenForConvert(convertId, userPostIds, ['attachmentToMessages.attachment', 'sender.user']);
        const now = new Date();
        console.log(`непрочитанные ${now.getTime() - start.getTime()}`)
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
    async sendMessage(
        @Req() req: ExpressRequest,
        @Param('convertId') convertId: string,
        @Body() messageCreateDto: MessageCreateDto
    ): Promise<{ id: string }> {
        const user = req.user as ReadUserDto;
        const userSenderPost = user.posts.find(post => post.id === messageCreateDto.postId)
        const convert = await this.convertService.findOneById(convertId, ['convertToPosts.post.user']);
        const isPostInConvert = convert.convertToPosts.some(convertToPost => convertToPost.post.id === userSenderPost.id) // ВОЗОМОЖНО ВЫНЕСТИ В ГУАРД, ПОКА ПОХУЙ
        const isPostWatcher = convert.watcherIds.some(watcherId => watcherId === userSenderPost.id)
        if (!isPostInConvert || isPostWatcher) {
            const err = new ForbiddenException('У вас нет доступа к отправке сообщений!');
            this.logger.error(err)
            throw err;
        }
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