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
import { OrganizationReadDto } from 'src/contracts/organization/read-organization.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { Logger } from 'winston';
import { PostUpdateDto } from 'src/contracts/post/update-post.dto';
import { IsNull } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  async findAll(): Promise<PostReadDto[]> {
    const posts = await this.postRepository.find();

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
      user: post.user,
      policy: post.policy,
      statistics: post.statistics,
      organization: post.organization,
      account: post.account,
    }));
  }

  async findAllForOrganization(
    organization: OrganizationReadDto,
  ): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { organization: { id: organization.id } },
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
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов!',
      );
    }
  }

  async findAllForAccount(
    account: AccountReadDto,
    relations?: string[],
  ): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { account: { id: account.id } },
        relations: relations !== undefined ? relations : [],
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
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов!',
      );
    }
  }

  async findAllWithoutParentId(
    account: AccountReadDto,
  ): Promise<PostReadDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: { account: { id: account.id }, parentId: IsNull() },
        relations: ['user', 'organization'],
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
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех постов!',
      );
    }
  }

  async findOneById(
    id: string,
    relations?: string[],
  ): Promise<PostReadDto> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: id },
        relations: relations !== undefined ? relations : [],
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
        user: post.user,
        policy: post.policy,
        statistics: post.statistics,
        organization: post.organization,
        account: post.account,
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
      const postWithMaxDivisionNumber = await this.postRepository
        .createQueryBuilder('post')
        .orderBy('post.divisionNumber', 'DESC')
        .getOne();

      if (!postWithMaxDivisionNumber) return 1;
      const postReadDto: PostReadDto = {
        id: postWithMaxDivisionNumber.id,
        postName: postWithMaxDivisionNumber.postName,
        divisionName: postWithMaxDivisionNumber.divisionName,
        divisionNumber: postWithMaxDivisionNumber.divisionNumber,
        parentId: postWithMaxDivisionNumber.parentId,
        product: postWithMaxDivisionNumber.product,
        purpose: postWithMaxDivisionNumber.purpose,
        createdAt: postWithMaxDivisionNumber.createdAt,
        updatedAt: postWithMaxDivisionNumber.updatedAt,
        user: postWithMaxDivisionNumber.user,
        policy: postWithMaxDivisionNumber.policy,
        statistics: postWithMaxDivisionNumber.statistics,
        organization: postWithMaxDivisionNumber.organization,
        account: postWithMaxDivisionNumber.account,
      };

      return postReadDto.divisionNumber;
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

  async create(postCreateDto: PostCreateDto): Promise<string> {
    try {
      // Проверка на наличие обязательных данных
      if (!postCreateDto.postName) {
        throw new BadRequestException('У поста обязательно наличие названия!');
      }
      if (!postCreateDto.product) {
        throw new BadRequestException('Выберите продукт поста!');
      }
      if (!postCreateDto.purpose) {
        throw new BadRequestException('Выберите предназначение поста!');
      }

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
      const createdPostId = await this.postRepository.insert(post);
      return createdPostId.identifiers[0].id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
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
      if (updatePostDto.divisionName)
        post.divisionName = updatePostDto.divisionName;
      if (updatePostDto.parentId !== null) {
        post.parentId = updatePostDto.parentId;
      }
      else {
        post.parentId = null;
      }
      if (updatePostDto.product) post.product = updatePostDto.product;
      if (updatePostDto.purpose) post.purpose = updatePostDto.purpose;
      if (updatePostDto.responsibleUserId !== null) {
        post.user = updatePostDto.user
      }
      else {
        post.user = null;
      }
      if (updatePostDto.organization)
        post.organization = updatePostDto.organization;
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
