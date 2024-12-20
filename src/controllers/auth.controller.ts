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
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Response as ExpressResponse } from 'express';
import { UserVkAuthDto } from '../contracts/user/user-vkauth-dto';
import { AuthVK } from '../contracts/auth-vk.dto';
import { AuthService } from '../application/services/auth/auth.service';
import { UsersService } from '../application/services/users/users.service';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { EventsGateway } from 'src/gateways/events.gateway';
import { JwtService } from '@nestjs/jwt';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthTG } from 'src/contracts/tg-auth.dto';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { profile } from 'console';
import { UpdateUserDto } from 'src/contracts/user/update-user.dto';
import { UpdateTgAuthUserDto } from 'src/contracts/user/update-tgauthUser.dto';
import { UpdateVkAuthUserDto } from 'src/contracts/user/update-vkauthUser.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly eventsGateway: EventsGateway,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  @Post('/login/vk')
  @ApiOperation({ summary: 'Войти через ВК' })
  @ApiBody({
    description: 'ДТО для логина',
    type: AuthVK,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {},
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async vk(
    @Headers('User-Agent') user_agent: string,
    @Body(new ValidationPipe()) auth: AuthVK,
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<UserVkAuthDto> {
    let authData;
    try {
      authData = await this.authService.getVkToken(auth);
    } catch (err) {
      throw new UnprocessableEntityException('Wrong VK code');
    }
    console.log(JSON.stringify(authData.data));
    const userData = await this.authService.getUserDataFromVk(
      authData.data.access_token,
    );
    console.log(JSON.stringify(`+${userData.data.user.phone}`));
    console.log(JSON.stringify(userData.data));
    const _user = await this.userService.findOneByTelephoneNumber(
      `+${userData.data.user.phone}`,
    );
    let updatedUser = _user;
    if (_user) {
      if (_user.vk_id) {
        const updateVkAuthUserDto: UpdateVkAuthUserDto = {
          vk_id: userData.data.user.user_id,
          avatar_url: userData.data.user.avatar,
        };
        updatedUser = await this.userService.updateVkAuth(
          _user,
          updateVkAuthUserDto,
        );
      }
      const authenticateResult = await this.authService.authenticateVK(
        updatedUser,
        ip,
        user_agent,
        auth.fingerprint,
      );
      res.cookie('refresh-tokenId', authenticateResult.refreshTokenId, {
        httpOnly: true,
        maxAge: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // 60 дней
      });
      return authenticateResult._user;
    } else {
      throw new BadRequestException(
        'Аккаунт на такой номер не найден! Пожалуйста, используйте номер, под которым вы регистрировались!',
      );
    }

    // try {
    //     const { data } = await this.authService.getUserDataFromVk(
    //         authData.data.user_id,
    //         authData.data.access_token
    //     );

    //     const profile = data.response[0];
    //     let user: CreateUserDto = {
    //         vk_id: authData.data.user_id,
    //         firstName: `${profile.first_name}`,
    //         lastName: `${profile.last_name}`,
    //         avatar_url: profile.photo_400,
    //         telephoneNumber: profile.mobile_phone ? profile.mobile_phone : null
    //     };
    //     const newUser = await this.userService.create(user);
    //     const authenticateResult = await this.authService.authenticateVK(newUser, ip, user_agent, auth.fingerprint);
    //     res.cookie('refresh-tokenId', authenticateResult.refreshTokenId, { httpOnly: true })
    //     return authenticateResult._user
    // } catch (err) {
    //     console.log(err);
    //     throw new UnprocessableEntityException(err);
    // }
  }

  // @UseGuards(RefreshTokenGuard)
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
          description: 'Уникальный идентификатор устройства',
        },
      },
      required: ['fingerprint'],
    },
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ОК!',
    example: {},
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка сервера!',
  })
  async refreshTokens(
    @Body() fingerprint: string,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ newAccessToken: string }> {
    const refreshTokenId = req.cookies['refresh-tokenId'];
    const data = await this.authService.updateTokens(
      req.body.fingerprint,
      refreshTokenId,
    );
    res.cookie('refresh-tokenId', data.newRefreshTokenId, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // 60 дней
    });
    return { newAccessToken: data.newAccessToken };
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
          description: 'Уникальный идентификатор устройства',
        },
      },
      required: ['fingerprint'],
    },
    required: true,
  })
  async logout(
    @Body() fingerprint: string,
    @Req() req: ExpressRequest,
  ): Promise<void> {
    const refreshTokenId = req.cookies['refresh-tokenId'];
    await this.authService.logout(req.body.fingerprint, refreshTokenId);
  }

  @Post('login/tg')
  @ApiOperation({ summary: 'НЕ ЧИПАТЬ!' })
  async tg(@Body() authTg: AuthTG, @Ip() ip: string): Promise<void> {
    // Запрашиваем у клиента необходимую информацию
    const requiredInfo = ['fingerprint', 'userAgent', 'ip', 'token'];
    const clientInfo = await this.eventsGateway.requestInfoFromClient(
      authTg.clientId,
      requiredInfo,
    );
    console.log(clientInfo.token);
    if (clientInfo.token === authTg.token) {
      const updateTgAuthUserDto: UpdateTgAuthUserDto = {
        telegramId: authTg.telegramId,
      };
      const user = await this.userService.findOneByTelephoneNumber(
        authTg.telephoneNumber,
      );
      let updateUser = user;
      console.log(user.telegramId)
      if (user.telegramId === null) {
        updateUser = await this.userService.updateTgAuth(
          user,
          updateTgAuthUserDto,
        );
      }
      const authenticateResult = await this.authService.authenticateTG(
        updateUser,
        clientInfo.ip,
        clientInfo.userAgent,
        clientInfo.fingerprint,
      );
      await this.eventsGateway.sendTokenToClient(
        authTg.clientId,
        authenticateResult._user.id,
        authenticateResult._user.token,
        authenticateResult.refreshTokenId,
      );
    } else {
      await this.eventsGateway.sendTokenToClient(
        authTg.clientId,
        'false',
        null,
        null,
      );
      throw new UnauthorizedException('Неуспешный вход!');
    }
  }

  @Post('set-cookie')
  setCookie(@Body('refreshTokenId') refreshTokenId: string, @Res({ passthrough: true }) res: ExpressResponse) {
    console.log(refreshTokenId)
    res.cookie('refresh-tokenId', refreshTokenId, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // 60 дней
    });
    // Завершите обработку запроса
    return { message: 'Cookie set successfully' };
  }

}
