import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { HttpService } from '@nestjs/axios';
import { ReadUserDto } from "src/contracts/read-user.dto";
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserVkAuthDto } from "src/contracts/user-vkauth-dto";
import { JwtPayloadInterface } from "src/utils/jwt-payload.interface";
import { User } from "src/domains/user.entity";
import * as argon2 from 'argon2';
import { ReadRefreshSessionDto } from "src/contracts/read-refreshSession.dto";
import { CreateRefreshSessionDto } from "src/contracts/create-refreshSession.dto";
import { RefreshService } from "../refreshSession/refresh.service";
import { session } from "passport";

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshService: RefreshService
  ) { }

  async validateUser(payload: JwtPayloadInterface): Promise<User | null> {
    return await this.usersService.findOne(payload.id);
  }

  async authenticate(
    auth: ReadUserDto, ip: string, user_agent: string, fingerprint: string): Promise<{ _user: UserVkAuthDto; refreshTokenId: string }> {

    try {
      const user = await this.usersService.findOne(auth.id);
      if (!user) {
        throw new BadRequestException();
      }
      
      const newSession: CreateRefreshSessionDto = {
        user_agent: user_agent,
        fingerprint: fingerprint,
        ip: ip,
        expiresIn: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // Время жизни сессии в секундах (например, 60 дней),
        refreshToken: await this.jwtService.signAsync({ id: user.id }),
        user: auth
    }
    await this.refreshService.create(newSession);
    
    const _newSession = await this.refreshService.findOneByFingerprint(newSession.fingerprint);
      const _user: UserVkAuthDto = {
        id: user.id,
        vk_id: user.vk_id,
        firstName: user.firstName,
        lastName: user.lastName,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        token: await this.jwtService.signAsync({ id: user.id })
      }
      return { _user: _user, refreshTokenId: _newSession.id };
    }
    catch (err) {
      console.log(err)
    }

  }

  async getVkToken(code: string): Promise<any> {
    const VKDATA = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    const host =
      process.env.NODE_ENV === "prod"
        ? process.env.APP_HOST
        : process.env.APP_LOCAL;

    return this.httpService
      .get(
        `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${host}/gm&code=${code}`
      )
      .toPromise();
  }


  async getUserDataFromVk(userId: string, token: string): Promise<any> {
    return this.httpService
      .get(
        `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_400,has_mobile,home_town,contacts,mobile_phone&access_token=${token}&v=5.120`
      )
      .toPromise();
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateTokens(fingerprint: string, refreshTokenId: string): Promise<{newRefreshTokenId: string; newAccessToken: string}> {
    const session = await this.refreshService.findOneByIdAndFingerprint(refreshTokenId, fingerprint)
    if (!session) {
      throw new UnauthorizedException('INVALID_REFRESH_SESSION', { cause: new Error(), description: 'Some error description' })
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = currentTime > session.expiresIn;
    if (isExpired) {
      throw new UnauthorizedException('TOKEN_EXPIRED');
    };
    const newSession: CreateRefreshSessionDto = {
      
      user_agent: session.user_agent,
      fingerprint: session.fingerprint,
      ip: session.ip,
      expiresIn: session.expiresIn,
      user: session.user
    };
    newSession.refreshToken = await this.jwtService.signAsync({ id: newSession.user.id })
    await this.refreshService.remove(session.id);
    
    await this.refreshService.create(newSession)

    const id = await this.refreshService.getId(newSession.refreshToken);
    
    const _newAccessToken = await this.jwtService.signAsync({ id: newSession.user.id })
    return {newRefreshTokenId: id, newAccessToken: _newAccessToken}

  }

}