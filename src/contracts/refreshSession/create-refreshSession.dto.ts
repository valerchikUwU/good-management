import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/domains/user.entity';

export class CreateRefreshSessionDto {
  user_agent: string;
  fingerprint: string;
  ip: string;
  expiresIn: number;
  @IsOptional()
  refreshToken?: string;
  user: User;
}
