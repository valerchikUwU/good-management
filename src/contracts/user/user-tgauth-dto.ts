import { IsUUID } from 'class-validator';

export class UserTgAuthDto {
  @IsUUID()
  id: string;
  token: string;

  // Вы можете добавить дополнительные поля в соответствии с вашими требованиями
}
