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
    NotFoundException
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

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,

        private readonly jwtService: JwtService,
        private readonly eventsGateway: EventsGateway
    ) { }

    @Post("/login/vk")
    async vk(@Headers('User-Agent') user_agent: string, @Body(new ValidationPipe()) auth: AuthVK, @Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) res: ExpressResponse): Promise<UserVkAuthDto> {
        let authData;
        try {
            authData = await this.authService.getVkToken(auth.code);
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException("Wrong VK code");
        }

        const _user = await this.userService.findByVkId(authData.data.user_id);

        console.log(user_agent);
        console.log(auth.fingerprint);
        console.log(ip);

        if (_user) {

            const authenticateResponse = await this.authService.authenticate(_user, ip, user_agent, auth.fingerprint);
            res.cookie('refresh-tokenId', authenticateResponse.refreshTokenId, { httpOnly: true })
            return authenticateResponse._user;
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
                telegramId: null,
                telephoneNumber: profile.mobile_phone ? profile.mobile_phone : null
            };
            await this.userService.create(user);
            const newUser = await this.userService.findByVkId(authData.data.user_id);
            const authenticateResponse = await this.authService.authenticate(newUser, ip, user_agent, auth.fingerprint);
            res.cookie('refresh-tokenId', authenticateResponse.refreshTokenId, { httpOnly: true })
            return authenticateResponse._user
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException(err);
        }
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh-tokens')
    async refreshTokens(@Body() fingerprint: string, @Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse): Promise<{ newAccessToken: string }> {
        const refreshTokenId = req.cookies['refresh-tokenId']
        const data = await this.authService.updateTokens(req.body.fingerprint, refreshTokenId);
        res.cookie('refresh-tokenId', data.newRefreshTokenId, { httpOnly: true, maxAge: 5184000000 })
        return { newAccessToken: data.newAccessToken }
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(@Body() fingerprint: string, @Req() req: ExpressRequest): Promise<void> {
        const refreshTokenId = req.cookies['refresh-tokenId']
        await this.authService.logout(req.body.fingerprint, refreshTokenId);
    }





    @Post('login/tg')
    async tg(@Body() telephoneNumber: string, telegramId: number, clientId: string, user_agent: string, ip: string, token: string) {

        const foundNumber = await this.userService.findOneByTelephoneNumber(telephoneNumber);

        // Запрашиваем у клиента необходимую информацию
        const requiredInfo = ['fingerprint', 'userAgent', 'token'];
        const clientInfo = await this.eventsGateway.requestInfoFromClient(clientId, requiredInfo);
        if (!clientInfo) {
            return { message: 'Не удалось получить информацию о клиенте' };
        }
        if (clientInfo.token === token) {
            if (foundNumber) {
                const user = await this.userService.updateByPhoneNumber(telephoneNumber, telegramId);
                const userId = user.id;
                // СОЗДАТЬ СЕССИЮ
                const newSession: CreateRefreshSessionDto = {
                    user_agent: user_agent,
                    fingerprint: 'fingerprint',
                    ip: ip,
                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // Время жизни сессии в секундах (например, 60 дней),
                    refreshToken: await this.jwtService.signAsync({ id: user.id }, {
                        secret: process.env.JWT_REFRESH_SECRET,
                        expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
                    }),
                    user: user
                }
                await this.eventsGateway.sendTokenToClient(clientId, userId)

            }
            else {
                throw new NotFoundException('No such number')
            }
        } else {
            await this.eventsGateway.sendTokenToClient(clientId, 'false')
        }
           

    }
}