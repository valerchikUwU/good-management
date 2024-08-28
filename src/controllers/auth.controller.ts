import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UnprocessableEntityException,
} from "@nestjs/common";

import { UserDto } from "../contracts/user-dto";
import { AuthVK } from '../contracts/auth-vk.dto'
import { AuthService } from "../application/services/auth/auth.service";
import { UsersService } from "../application/services/users/users.service";
import { ReadUserDto } from "src/contracts/read-user.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) { }

    @Post("/login/vk")
    async vk(@Body(new ValidationPipe()) auth: AuthVK): Promise<UserDto> {
        let authData;

        try {
            authData = await this.authService.getVkToken(auth.code);
        } catch (err) {
            throw new UnprocessableEntityException("Wrong VK code");
        }


        const _user = await this.userService.findByVkId(authData.data.user_id);

        if (_user) {
            return this.authService.authenticate(_user);
        }

        try {
            const { data } = await this.authService.getUserDataFromVk(
                authData.data.user_id,
                authData.data.access_token
            );

            const profile = data.response[0];

            let user: ReadUserDto = {
                id: _user.id,
                vk_id: authData.data.user_id,
                firstName: `${profile.first_name}`,
                lastName: `${profile.last_name}`,
                avatar_url: profile.photo_400,
                telegramId: _user.telegramId,
                telephoneNumber: _user.telephoneNumber
            };

            await this.userService.create(user);

            return this.authService.authenticate(user);
        } catch (err) {
            throw new UnprocessableEntityException(err);
        }
    }
}