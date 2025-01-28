import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsString,
  MaxLength,
} from 'class-validator';
import { Convert } from 'src/domains/convert.entity';
import { Post } from 'src/domains/post.entity';

export class MessageCreateDto {
  @IsString()
  @MaxLength(200)
  content: string;

  @IsString()
  postId: string;

  attachmentIds: string[];

  @Exclude({ toPlainOnly: true })
  convert: Convert;

  @Exclude({ toPlainOnly: true })
  sender: Post;
}
