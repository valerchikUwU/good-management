import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UnprocessableEntityException,
    Req,
    Ip,
    Res,
    Header,
    Headers,
    UseGuards,
    Get,
    HttpCode,
    Delete,
    NotFoundException,
    HttpStatus,
    InternalServerErrorException,
    UnauthorizedException,
    Inject
} from "@nestjs/common";
import { Request as ExpressRequest } from 'express';
import { Response as ExpressResponse } from "express";
import { UserVkAuthDto } from "../contracts/user/user-vkauth-dto";
import { AuthVK } from '../contracts/auth-vk.dto'
import { AuthService } from "../application/services/auth/auth.service";
import { UsersService } from "../application/services/users/users.service";
import { CreateUserDto } from "src/contracts/user/create-user.dto";
import { RefreshService } from "src/application/services/refreshSession/refresh.service";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { RefreshTokenGuard } from "src/guards/refreshToken.guard";
import { EventsGateway } from "src/gateways/events.gateway";
import { UpdateUserDto } from "src/contracts/user/update-user.dto";
import { CreateRefreshSessionDto } from "src/contracts/refreshSession/create-refreshSession.dto";
import { JwtService } from "@nestjs/jwt";

import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTG } from "src/contracts/tg-auth.dto";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';

@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly eventsGateway: EventsGateway,
        @Inject('winston') private readonly logger: Logger
    ) { }

    @Post("/login/vk")
    @ApiOperation({ summary: 'Войти через ВК' })
    @ApiBody({
        description: 'ДТО для логина',
        type: AuthVK,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    async vk(@Headers('User-Agent') user_agent: string, @Body(new ValidationPipe()) auth: AuthVK, @Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) res: ExpressResponse): Promise<UserVkAuthDto> {
        let authData;
        try {
            authData = await this.authService.getVkToken(auth.code);
        } catch (err) {
            throw new UnprocessableEntityException("Wrong VK code");
        }

        const _user = await this.userService.findByVkId(authData.data.user_id);


        if (_user) {

            const authenticateResult = await this.authService.authenticateVK(_user, ip, user_agent, auth.fingerprint);
            res.cookie('refresh-tokenId', authenticateResult.refreshTokenId, { httpOnly: true })
            return authenticateResult._user;
        }

        try {
            const { data } = await this.authService.getUserDataFromVk(
                authData.data.user_id,
                authData.data.access_token
            );

            const profile = data.response[0];
            let user: CreateUserDto = {
                vk_id: authData.data.user_id,
                firstName: `${profile.first_name}`,
                lastName: `${profile.last_name}`,
                avatar_url: profile.photo_400,
                telephoneNumber: profile.mobile_phone ? profile.mobile_phone : null
            };
            const newUser = await this.userService.create(user);
            const authenticateResult = await this.authService.authenticateVK(newUser, ip, user_agent, auth.fingerprint);
            res.cookie('refresh-tokenId', authenticateResult.refreshTokenId, { httpOnly: true })
            return authenticateResult._user
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException(err);
        }
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh-tokens')
    @ApiOperation({ summary: 'Обновить токены' })
    @ApiBody({
        description: 'Данные для аутентификации',
        type: String,
        schema: {
            type: 'object',
            properties: {
                fingerprint: {
                    type: 'string',
                    description: 'Уникальный идентификатор устройства'
                }
            },
            required: ['fingerprint']
        },
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {
        }
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    async refreshTokens(@Body() fingerprint: string, @Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse): Promise<{ newAccessToken: string }> {
        const refreshTokenId = req.cookies['refresh-tokenId']
        const data = await this.authService.updateTokens(req.body.fingerprint, refreshTokenId);
        res.cookie('refresh-tokenId', data.newRefreshTokenId, { httpOnly: true, maxAge: 5184000000 })
        return { newAccessToken: data.newAccessToken }
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @ApiOperation({ summary: 'Выход' })
    @ApiBody({
        description: 'Данные для выхода',
        type: String,
        schema: {
            type: 'object',
            properties: {
                fingerprint: {
                    type: 'string',
                    description: 'Уникальный идентификатор устройства'
                }
            },
            required: ['fingerprint']
        },
        required: true,
    })
    async logout(@Body() fingerprint: string, @Req() req: ExpressRequest): Promise<void> {
        const refreshTokenId = req.cookies['refresh-tokenId']
        await this.authService.logout(req.body.fingerprint, refreshTokenId);
    }





    @Post('login/tg')
    @ApiOperation({ summary: 'НЕ ЧИПАТЬ!' })
    async tg(@Body() authTg: AuthTG, @Ip() ip: string): Promise<void> {
        // Запрашиваем у клиента необходимую информацию
        const requiredInfo = ['fingerprint', 'userAgent', 'ip', 'token'];
        const clientInfo = await this.eventsGateway.requestInfoFromClient(authTg.clientId, requiredInfo);
        if (clientInfo.token === authTg.token) {
            if (authTg.createUserFlag) {
                const createUserDto: CreateUserDto = {
                    firstName: authTg.firstName,
                    lastName: authTg.lastName,
                    telegramId: authTg.telegramId,
                    telephoneNumber: authTg.telephoneNumber
                }
                const newUser = await this.userService.create(createUserDto);
                const authenticateResult = await this.authService.authenticateTG(newUser, clientInfo.ip, clientInfo.userAgent, clientInfo.fingerprint);
                await this.eventsGateway.sendTokenToClient(authTg.clientId, authenticateResult._user.id, authenticateResult.refreshTokenId, authenticateResult._user.token)
            }
            else {
                const user = await this.userService.findOneByTelegramId(authTg.telegramId);
                const authenticateResult = await this.authService.authenticateTG(user, clientInfo.ip, clientInfo.userAgent, clientInfo.fingerprint);
                await this.eventsGateway.sendTokenToClient(authTg.clientId, authenticateResult._user.id, authenticateResult.refreshTokenId, authenticateResult._user.token)
            }

        } else {
            await this.eventsGateway.sendTokenToClient(authTg.clientId, 'false', null, null);
            throw new UnauthorizedException('Неуспешный вход!')
        }
    }
}