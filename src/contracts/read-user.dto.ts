import { IsUUID } from 'class-validator';
import { ReadRefreshSessionDto } from './read-refreshSession.dto';

export class ReadUserDto {
    @IsUUID()
    id: string;
    firstName: string;
    lastName: string;
    telegramId: number;
    telephoneNumber: string;
    avatar_url: string;
    vk_id: number;
    refreshSessions: ReadRefreshSessionDto[];
  
    // Вы можете добавить дополнительные поля в соответствии с вашими требованиями
  }