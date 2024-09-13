import { IsUUID } from 'class-validator';

export class UserTgAuthDto {

  @IsUUID()
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  telephoneNumber: string | null;
  telegramId: number
  token: string;

  // Вы можете добавить дополнительные поля в соответствии с вашими требованиями
}