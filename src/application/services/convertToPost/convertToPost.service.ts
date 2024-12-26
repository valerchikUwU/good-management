import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { ConvertToPost } from 'src/domains/convertToPost.entity';
import { ConvertToPostRepository } from './repository/convertToPost.repository';
import { Convert } from 'src/domains/convert.entity';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { PostService } from '../post/post.service';
// import { ConvertToUserCreateDto } from "src/contracts/convertToUser/create-convertToUser.dto";

@Injectable()
export class ConvertToPostService {
  constructor(
    @InjectRepository(ConvertToPost)
    private readonly convertToPostRepository: ConvertToPostRepository,
    private readonly postService: PostService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async createSeveral(convert: Convert, postIds: string[]): Promise<string[]> {
    const createdRelations: string[] = [];

    for (const postId of postIds) {
      try {
        const post = await this.postService.findOneById(postId);

        const convertToPost = new ConvertToPost();
        convertToPost.post = post;
        convertToPost.convert = convert;

        const savedRelationId = await this.convertToPostRepository.insert(convertToPost);
        createdRelations.push(savedRelationId.identifiers[0].id);
      } catch (err) {
        this.logger.error(err);

        throw new InternalServerErrorException(
          'Ой, что - то пошло не так при добавлении участников к чату!',
        );
        // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
      }
    }

    return createdRelations;
  }

  async remove(convert: ConvertReadDto): Promise<void> {
    await this.convertToPostRepository.delete({ convert: convert });
  }
}
