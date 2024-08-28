import { IsUUID } from 'class-validator';

export class UserDto {
    @IsUUID()
    id: string;
    firstName: string;
    lastName: string;
    telegramId: string;
    telephoneNumber: string;
    vk_id: number;
    avatar_url: string;
    token: string;
  
    // Вы можете добавить дополнительные поля в соответствии с вашими требованиями
  }