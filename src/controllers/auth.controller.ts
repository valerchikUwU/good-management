import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UnprocessableEntityException,
} from "@nestjs/common";

import { UserVkAuthDto } from "../contracts/user-vkauth-dto";
import { AuthVK } from '../contracts/auth-vk.dto'
import { AuthService } from "../application/services/auth/auth.service";
import { UsersService } from "../application/services/users/users.service";
import { CreateUserVkDto } from "src/contracts/create-userVk.dto";
import { GeneratorUUID } from "src/application/services/GeneratorUUID/generator.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly generatorService: GeneratorUUID
    ) { }

    @Post("/login/vk")
    async vk(@Body(new ValidationPipe()) auth: AuthVK): Promise<UserVkAuthDto> {
        let authData;

        try {
            authData = await this.authService.getVkToken(auth.code);
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException("Wrong VK code");
        }

        console.log(JSON.stringify(authData))
        const _user = await this.userService.getByVkId(authData.data.user_id);
        
        if (_user) {
            return this.authService.authenticate(_user);
        }

        try {
            const { data } = await this.authService.getUserDataFromVk(
                authData.data.user_id,
                authData.data.access_token
            );

            const profile = data.response[0];

            let user: CreateUserVkDto = {
                id: this.generatorService.generateUUID(),
                vk_id: authData.data.user_id,
                firstName: `${profile.first_name}`,
                lastName: `${profile.last_name}`,
                avatar_url: profile.photo_400,
                telegramId: null,
                telephoneNumber: profile.mobile_phone ? profile.mobile_phone : null
            };
            console.log(JSON.stringify(user))
            await this.userService.create(user);

            return this.authService.authenticate(user);
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException(err);
        }
    }
}