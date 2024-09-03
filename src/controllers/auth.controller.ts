import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UnprocessableEntityException,
    Req,
    Ip,
    Res,
} from "@nestjs/common";
import { Request as ExpressRequest } from 'express';
import { Response as ExpressResponse } from "express";
import { UserVkAuthDto } from "../contracts/user-vkauth-dto";
import { AuthVK } from '../contracts/auth-vk.dto'
import { AuthService } from "../application/services/auth/auth.service";
import { UsersService } from "../application/services/users/users.service";
import { GeneratorUUID } from "src/application/services/GeneratorUUID/generator.service";
import { CreateUserDto } from "src/contracts/create-user.dto";
import { RefreshService } from "src/application/services/refreshSession/refresh.service";
import { CreateRefreshSessionDto } from "src/contracts/create-refreshSession.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly generatorService: GeneratorUUID,
        private readonly refreshSession: RefreshService
    ) { }

    @Post("/login/vk")
    async vk(@Body(new ValidationPipe()) auth: AuthVK, @Req() req: Request, @Ip() ip: string): Promise<{_user: UserVkAuthDto; refreshTokenId: string}> {
        let authData;
        try {
            authData = await this.authService.getVkToken(auth.code);
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException("Wrong VK code");
        }

        const _user = await this.userService.getByVkId(authData.data.user_id);

        console.log(req.headers['user_agent']);
        console.log(auth.fingerprint);
        console.log(ip);

        if (_user) {
            let newSession: CreateRefreshSessionDto = {
                user_agent: req.headers['user_agent'],
                fingerprint: auth.fingerprint,
                ip: ip,
                expiresIn: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // Время жизни сессии в секундах (например, 60 дней),
                user: _user
            }
            await this.refreshSession.create(newSession);
            return await this.authService.authenticate(_user, newSession);
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
            const newUser = await this.userService.getByVkId(authData.data.user_id);
            
            let newSession: CreateRefreshSessionDto = {
                user_agent: req.headers['user_agent'],
                fingerprint: auth.fingerprint,
                ip: ip,
                expiresIn: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // Время жизни сессии в секундах (например, 60 дней),
                user: newUser
            }
            
            await this.refreshSession.create(newSession);
            return this.authService.authenticate(newUser, newSession);
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException(err);
        }
    }


    @Post('refresh-tokens')
    async refreshTokens(@Body() fingerprint: string, @Req() req: ExpressRequest, @Res({passthrough: true}) res: ExpressResponse): Promise<{newAccessToken: string}>{
        const refreshTokenId = req.cookies['refresh-tokenId']
        const data = await this.authService.updateTokens(fingerprint, refreshTokenId);
        res.cookie('refresh-tokenId', data.newRefreshTokenId)
        return {newAccessToken: data.newAccessToken}
    }
}