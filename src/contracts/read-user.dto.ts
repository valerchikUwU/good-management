import { IsUUID } from 'class-validator';

export class ReadUserDto {
    @IsUUID()
    id: string;
    firstName: string;
    lastName: string;
    telegramId: number;
    telephoneNumber: string;
    avatar_url: string;
    vk_id: number;
  
    // Вы можете добавить дополнительные поля в соответствии с вашими требованиями
  }