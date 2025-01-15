import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsString,
} from 'class-validator';
import { Convert } from 'src/domains/convert.entity';
import { Post } from 'src/domains/post.entity';

export class MessageCreateDto {
  @IsString()
  content: string;

  @IsString()
  postId: string;

  @Exclude({ toPlainOnly: true })
  convert: Convert;

  @Exclude({ toPlainOnly: true })
  sender: Post;
}
