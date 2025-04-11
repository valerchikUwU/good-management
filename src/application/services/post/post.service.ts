import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/domains/post.entity';
import { PostRepository } from './repository/post.repository';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
import { PostCreateDto } from 'src/contracts/post/create-post.dto';
import { Logger } from 'winston';
import { PostUpdateDto } from 'src/contracts/post/update-post.dto';
import { Brackets, FindOptionsWhere, In, IsNull, Not } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    @Inject('winston') private readonly logger: Logger,
  ) { }




  async findAllForOrganization(organizationId: string, structure: boolean, relations?: string[]): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { organization: { id: organizationId } },
        relations: relations ?? [],
      });

      return posts.map((post) => ({
        id: post.id,
        postName: post.postName,
        divisionName: post.divisionName,
        divisionNumber: post.divisionNumber,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        targets: post.targets,
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
        convert: post.convert,
        historiesUsersToPost: post.historiesUsersToPost,
        targetHolders: post.targetHolders,
        convertToPosts: post.convertToPosts,
        messages: post.messages,
        controlPanels: post.controlPanels,
        role: post.role,
        groupToPosts: post.groupToPosts,
        underPosts: structure === true ? posts.filter(underPost => underPost.parentId === post.id) : null
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов для организации!',
      );
    }
  }

  async findAllForUser(userId: string, relations?: string[]): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: {
          user: { id: userId },
        },
        relations: relations ?? [],
      });

      return posts.map((post) => ({
        id: post.id,
        postName: post.postName,
        divisionName: post.divisionName,
        divisionNumber: post.divisionNumber,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        targets: post.targets,
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
        convert: post.convert,
        historiesUsersToPost: post.historiesUsersToPost,
        targetHolders: post.targetHolders,
        convertToPosts: post.convertToPosts,
        messages: post.messages,
        controlPanels: post.controlPanels,
        role: post.role,
        groupToPosts: post.groupToPosts,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов для юзера!',
      );
    }
  }

  async findAllWithUserForOrganization(organizationId: string, relations?: string[]): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { organization: { id: organizationId }, user: { id: Not(IsNull()) } },
        relations: relations ?? [],
      });

      return posts.map((post) => ({
        id: post.id,
        postName: post.postName,
        divisionName: post.divisionName,
        divisionNumber: post.divisionNumber,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        targets: post.targets,
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
        convert: post.convert,
        historiesUsersToPost: post.historiesUsersToPost,
        targetHolders: post.targetHolders,
        convertToPosts: post.convertToPosts,
        messages: post.messages,
        controlPanels: post.controlPanels,
        role: post.role,
        groupToPosts: post.groupToPosts,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов для организации!',
      );
    }
  }

  async findAllWithoutUserForOrganization(organizationId: string, relations?: string[]): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { organization: { id: organizationId }, user: { id: IsNull() } },
        relations: relations ?? [],
      });

      return posts.map((post) => ({
        id: post.id,
        postName: post.postName,
        divisionName: post.divisionName,
        divisionNumber: post.divisionNumber,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        targets: post.targets,
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
        convert: post.convert,
        historiesUsersToPost: post.historiesUsersToPost,
        targetHolders: post.targetHolders,
        convertToPosts: post.convertToPosts,
        messages: post.messages,
        controlPanels: post.controlPanels,
        role: post.role,
        groupToPosts: post.groupToPosts,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов без юзеров!',
      );
    }
  }

  async findAllContactsForCurrentUser(userPostsIds: string[]): Promise<any> {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.user', 'user')
        .innerJoin('post.convertToPosts', 'ctp')  // связь post → ConvertToPosts
        .innerJoin('ctp.convert', 'c')  // связь ConvertToPosts → Convert (чаты)
        .leftJoin('c.watchersToConvert', 'wtc', 'wtc.postId IN (:...userPostsIds)', { userPostsIds })
        .leftJoin('wtc.post', 'watcher')
        .leftJoin(
          'c.messages',
          'unreadMessages',
          `NOT EXISTS (
            SELECT 1 FROM "message_seen_status" "mrs"
            WHERE "mrs"."messageId" = "unreadMessages"."id"
            AND "mrs"."postId" IN (:...userPostsIds)
          ) 
          AND "unreadMessages"."senderId" NOT IN (:...userPostsIds)
          AND "watcher"."id" IS NULL`, { userPostsIds }
        )        
        .leftJoin(
          'c.messages',
          'latestMessage',
          '"latestMessage"."messageNumber" = (SELECT MAX("m"."messageNumber") FROM "message" "m" WHERE "m"."convertId" = "c"."id")'
        )
        .where('"post"."id" NOT IN (:...userPostsIds)', { userPostsIds })
        .andWhere(new Brackets((qb) => {
          qb.where('"c"."pathOfPosts"[1] IN (:...userPostsIds)', { userPostsIds })
            .andWhere('"c"."pathOfPosts"[array_length("c"."pathOfPosts", 1)] = "post"."id"')
            .orWhere(new Brackets((qb) => {
              qb.where('"c"."pathOfPosts"[1] = "post"."id"')
                .andWhere(new Brackets((qb) => {
                  qb.where(`EXISTS (
                      SELECT 1 FROM "convert_to_post" "sub_ctp"
                      INNER JOIN "post" "sub_post" ON "sub_ctp"."postId" = "sub_post"."id"
                      WHERE "sub_ctp"."convertId" = c.id
                      AND "sub_post"."id" IN (:...userPostsIds)
                  )`)
                    .orWhere('watcher.id IN (:...userPostsIds)', { userPostsIds })
                }))
            }))
        }))
        .select([
          'post.id AS "id"',
          'post.postName AS "postName"',
          'post.divisionName AS "divisionName"',
          'post.createdAt AS "createdAt"',
          'post.updatedAt AS "updatedAt"',
          'user.id AS "userId"',
          'user.firstName AS "userFirstName"',
          'user.lastName AS "userLastName"',
          'user.telegramId AS "userTelegramId"',
          'user.telephoneNumber AS "userTelephoneNumber"',
          'user.avatar_url AS "userAvatar"',
          'MAX("latestMessage"."createdAt") AS "latestMessageCreatedAt"',
          'SUM("wtc"."unreadMessagesCount") AS "watcherUnseenCount"',
          'COUNT("unreadMessages"."id") AS "unseenMessagesCount"',
        ])
        .groupBy('post.id, user.id')
        .getRawMany();
      return posts
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех контактов!',
      );
    }
  }


  async findBulk(ids: string[], relations?: string[]): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { id: In(ids) },
        relations: relations ?? []
      });
      const foundIds = posts.map(post => post.id);
      const missingIds = ids.filter(id => !foundIds.includes(id));
      if (missingIds.length > 0) {
        throw new NotFoundException(
          `Не найдены посты с IDs: ${missingIds.join(', ')}`,
        );
      }
      return posts.map((post) => ({
        id: post.id,
        postName: post.postName,
        divisionName: post.divisionName,
        divisionNumber: post.divisionNumber,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        targets: post.targets,
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
        convert: post.convert,
        historiesUsersToPost: post.historiesUsersToPost,
        targetHolders: post.targetHolders,
        convertToPosts: post.convertToPosts,
        messages: post.messages,
        controlPanels: post.controlPanels,
        role: post.role,
        groupToPosts: post.groupToPosts,
      }));

    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении статистик');
    }
  }




  async findOneById(id: string, relations?: string[]): Promise<PostReadDto> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: id },
        relations: relations ?? [],
      });

      if (!post) throw new NotFoundException(`Пост с ID: ${id} не найден`);
      const postReadDto: PostReadDto = {
        id: post.id,
        postName: post.postName,
        divisionName: post.divisionName,
        divisionNumber: post.divisionNumber,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        targets: post.targets,
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
        convert: post.convert,
        historiesUsersToPost: post.historiesUsersToPost,
        targetHolders: post.targetHolders,
        convertToPosts: post.convertToPosts,
        messages: post.messages,
        controlPanels: post.controlPanels,
        role: post.role,
        groupToPosts: post.groupToPosts,
      };

      return postReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении поста');
    }
  }

  async findMaxDivisionNumber(): Promise<number> {
    try {
      const maxDivisionNumber = await this.postRepository.maximum('divisionNumber')
      if (!maxDivisionNumber) return 1;
      return maxDivisionNumber;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении поста');
    }
  }

  async getHierarchyToTop(postId: string): Promise<string[]> {
    const hierarchyIds: string[] = [];
    let currentPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    while (currentPost && currentPost.parentId) {
      hierarchyIds.push(currentPost.id);
      currentPost = await this.postRepository.findOne({
        where: { id: currentPost.parentId },
        relations: ['user'],
      });
    }
    // Добавляем верхний уровень (пост без parentId)
    if (currentPost) hierarchyIds.push(currentPost.id);
    return hierarchyIds;
  }

  async getParentPosts(postId: string): Promise<PostReadDto[]> {
    const parentPosts: PostReadDto[] = [];
    let currentPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    while (currentPost && currentPost.parentId) {
      parentPosts.push(currentPost);
      currentPost = await this.postRepository.findOne({
        where: { id: currentPost.parentId },
        relations: ['user'],
      });
    }
    // Добавляем верхний уровень (пост без parentId)
    if (currentPost) parentPosts.push(currentPost);
    return parentPosts;
  }

  async getChildrenPosts(postId: string): Promise<PostReadDto[]> {
    const childrenPosts: PostReadDto[] = [];
    const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['user'] })
    // Находим прямых потомков
    const directChildren = await this.postRepository.find({ where: { parentId: post.id, user: { id: Not(post.user.id) } }, relations: ['user'] });
    // Добавляем прямых потомков в результат
    childrenPosts.push(...directChildren);
    // Рекурсивно ищем потомков для каждого прямого потомка
    for (const child of directChildren) {
      const grandchildren = await this.getChildrenPosts(child.id);
      childrenPosts.push(...grandchildren);
    }
    return childrenPosts;
  }

  async create(postCreateDto: PostCreateDto): Promise<string> {
    try {

      const post = new Post();
      post.postName = postCreateDto.postName;
      post.divisionName = postCreateDto.divisionName;
      post.parentId = postCreateDto.parentId;
      post.product = postCreateDto.product;
      post.purpose = postCreateDto.purpose;
      post.user = postCreateDto.user;
      post.organization = postCreateDto.organization;
      post.policy = postCreateDto.policy;
      post.account = postCreateDto.account;
      post.role = postCreateDto.role;
      const createdPostId = await this.postRepository.insert(post);
      if (postCreateDto.responsibleUserId) {
        await this.cacheService.del(`user:${postCreateDto.responsibleUserId}`)
      }
      return createdPostId.identifiers[0].id;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании поста');
    }
  }

  async update(_id: string, updatePostDto: PostUpdateDto): Promise<string> {
    try {
      const post = await this.postRepository.findOne({ where: { id: _id } });
      if (!post) {
        throw new NotFoundException(`Пост с ID ${_id} не найден`);
      }
      // Обновить свойства, если они указаны в DTO
      if (updatePostDto.postName) post.postName = updatePostDto.postName;
      if (updatePostDto.divisionName) post.divisionName = updatePostDto.divisionName;
      if (updatePostDto.parentId !== null) {
        post.parentId = updatePostDto.parentId;
      }
      else {
        post.parentId = null;
      }

      if (updatePostDto.product) post.product = updatePostDto.product;
      if (updatePostDto.purpose) post.purpose = updatePostDto.purpose;
      if (updatePostDto.responsibleUserId !== null) {
        post.user = updatePostDto.user;
        await this.cacheService.del(`user:${updatePostDto.responsibleUserId}`)
      }
      else {
        post.user = null;
      }

      if (updatePostDto.policyId !== null) {
        post.policy = updatePostDto.policy;
      } else {
        post.policy = null;
      }

      await this.postRepository.update(post.id, {
        postName: post.postName,
        divisionName: post.divisionName,
        parentId: post.parentId,
        product: post.product,
        purpose: post.purpose,
        user: post.user,
        organization: post.organization,
        policy: post.policy,
      });
      return post.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении поста');
    }
  }
}