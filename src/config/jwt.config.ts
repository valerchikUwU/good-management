// jwt.config.ts
import { ConfigModule, ConfigService } from 'nestjs-config';

export interface JwtConfig {
  access: {
    secretOrPrivateKey: string;
    signOptions: {
      expiresIn: string;
    };
  };
  refresh: {
    secretOrPrivateKey: string;
    signOptions: {
      expiresIn: string;
    };
  };
}

export const jwtConfig: JwtConfig = {
  access: {
    secretOrPrivateKey: process.env.JWT_ACCESS_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
    },
  },
  refresh: {
    secretOrPrivateKey: process.env.JWT_REFRESH_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
    },
  },
};

export async function jwtConfigFactory(configService: ConfigService): Promise<JwtConfig> {
  return configService.get('jwt');
}
