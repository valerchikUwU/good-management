import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserVkAuthDto } from 'src/contracts/user/user-vkauth-dto';
import { JwtPayloadInterface } from 'src/utils/jwt-payload.interface';
import { User } from 'src/domains/user.entity';
import { CreateRefreshSessionDto } from 'src/contracts/refreshSession/create-refreshSession.dto';
import { RefreshService } from '../refreshSession/refresh.service';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { Session } from 'inspector';
import { UserTgAuthDto } from 'src/contracts/user/user-tgauth-dto';
import { Logger } from 'winston';
import { AuthVK } from 'src/contracts/auth-vk.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshService: RefreshService,
    @InjectConfig() private readonly config: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async validateUser(payload: JwtPayloadInterface): Promise<User | null> {
    return await this.usersService.findOne(payload.id);
  }

  async authenticateVK(
    auth: ReadUserDto,
    ip: string,
    user_agent: string,
    fingerprint: string,
  ): Promise<{ _user: UserVkAuthDto; refreshTokenId: string }> {
    try {
      const user = await this.usersService.findOne(auth.id);
      if (!user) {
        throw new BadRequestException();
      }

      const newSession: CreateRefreshSessionDto = {
        user_agent: user_agent,
        fingerprint: fingerprint,
        ip: ip,
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // Время жизни сессии в секундах (например, 60 дней),
        refreshToken: await this.jwtService.signAsync(
          { id: user.id },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
          },
        ),
        user: auth,
      };
      const _newSession = await this.refreshService.create(newSession);
      const _user: UserVkAuthDto = {
        id: user.id,
        vk_id: user.vk_id,
        firstName: user.firstName,
        lastName: user.lastName,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        token: await this.jwtService.signAsync(
          { id: user.id },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
          },
        ),
      };

      return { _user: _user, refreshTokenId: _newSession.id };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof BadRequestException) {
        throw err;
      }
      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при входе через ВК!');
    }
  }

  async getVkToken(auth: AuthVK): Promise<any> {
    try {
      const VKDATA = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      };

      const host =
        process.env.NODE_ENV === 'prod'
          ? process.env.API_HOST
          : process.env.API_LOCAL;
      return this.httpService
        .post(
          `https://id.vk.com/oauth2/auth`, // Корректный endpoint для получения токена
          {
            grant_type: 'authorization_code',
            code_verifier: auth.code_verifier,
            redirect_uri: host, // Убедитесь, что этот redirect_uri совпадает с тем, что вы использовали при запросе кода
            code: auth.code,
            client_id: VKDATA.client_id,
            client_secret: VKDATA.client_secret,
            device_id: auth.device_id,
            state: auth.state,
          },
        )
        .toPromise();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении токена ВК!');
    }
  }

  async getUserDataFromVk(access_token: string): Promise<any> {
    try {
      const VKDATA = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      };
      return this.httpService
        .post(`https://id.vk.com/oauth2/user_info`, {
          client_id: VKDATA.client_id,
          access_token: access_token,
        })
        .toPromise();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Ошибка при получении данных о пользователе ВК!',
      );
    }
  }

  async updateTokens(
    fingerprint: string,
    refreshTokenId: string,
  ): Promise<{ newRefreshTokenId: string; newAccessToken: string }> {
    try {
      const session = await this.refreshService.findOneByIdAndFingerprint(
        String(refreshTokenId),
        String(fingerprint),
      );
      if (!session) {
        throw new UnauthorizedException(
          'Войдите в свой аккаунт для дальнейшей работы!',
        );
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = currentTime > session.expiresIn;
      if (isExpired) {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      const newSession: CreateRefreshSessionDto = {
        user_agent: session.user_agent,
        fingerprint: session.fingerprint,
        ip: session.ip,
        expiresIn: session.expiresIn,
        refreshToken: await this.jwtService.signAsync(
          { id: session.user.id },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
          },
        ),
        user: session.user,
      };

      await this.refreshService.remove(session.id);

      await this.refreshService.create(newSession);

      const id = await this.refreshService.getId(newSession.refreshToken);

      const _newAccessToken = await this.jwtService.signAsync(
        { id: newSession.user.id },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
        },
      );
      return { newRefreshTokenId: id, newAccessToken: _newAccessToken };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Ой, что - то пошло не так при обновлении токенов!',
      );
    }
  }

  async logout(fingerprint: string, refreshTokenId: string): Promise<void> {
    try {
      const session = await this.refreshService.findOneByIdAndFingerprint(
        String(refreshTokenId),
        String(fingerprint),
      );
      if (!session) {
        throw new UnauthorizedException(
          'Войдите в свой аккаунт для дальнейшей работы!',
        );
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = currentTime > session.expiresIn;
      if (isExpired) {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      await this.refreshService.remove(session.id);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Ой, что - то пошло не так при обновлении токенов!',
      );
    }
  }

  async authenticateTG(
    auth: ReadUserDto,
    ip: string,
    user_agent: string,
    fingerprint: string,
  ): Promise<{ _user: UserTgAuthDto; refreshTokenId: string }> {
    try {
      const user = await this.usersService.findOne(auth.id);
      if (!user) {
        throw new BadRequestException();
      }

      const newSession: CreateRefreshSessionDto = {
        user_agent: user_agent,
        fingerprint: fingerprint,
        ip: ip,
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60, // Время жизни сессии в секундах (например, 60 дней),
        refreshToken: await this.jwtService.signAsync(
          { id: user.id },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
          },
        ),
        user: auth,
      };
      console.log(`${JSON.stringify(newSession)}`);
      const _newSession = await this.refreshService.create(newSession);
      const _user: UserTgAuthDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        telephoneNumber: user.telephoneNumber,
        telegramId: user.telegramId,
        token: await this.jwtService.signAsync(
          { id: user.id },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
          },
        ),
      };

      return { _user: _user, refreshTokenId: _newSession.id };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof BadRequestException) {
        throw err;
      }
      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при входе черет ТГ!');
    }
  }


  async isSessionExpired(ip: string, fingerprint: string): Promise<{isExpired: boolean, userId: string}>{
    const session = await this.refreshService.findOneByIpAndFingerprint(
      String(ip),
      String(fingerprint),
    );
    if (session === null) {
      return {isExpired: false, userId: null};
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = currentTime > session.expiresIn;
    return {isExpired: isExpired, userId: session.user.id};
  }
}
