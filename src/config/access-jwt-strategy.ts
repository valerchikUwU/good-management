import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../application/services/auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadInterface } from '../utils/jwt-payload.interface';
import { User } from '../domains/user.entity';
import { InjectConfig, ConfigService } from 'nestjs-config';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectConfig() config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.access.secretOrPrivateKey'),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}