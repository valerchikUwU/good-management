import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetHolder } from 'src/domains/targetHolder.entity';
import { TargetHolderRepository } from './repository/targetHolder.repository';
import { TargetHolderReadDto } from 'src/contracts/targetHolder/read-targetHolder.dto';
import { TargetHolderCreateDto } from 'src/contracts/targetHolder/create-targetHolder.dto';
import { TargetReadDto } from 'src/contracts/target/read-target.dto';
import { PostService } from '../post/post.service';
import { In } from 'typeorm';

@Injectable()
export class TargetHolderService {
  constructor(
    @InjectRepository(TargetHolder)
    private readonly targetHolderRepository: TargetHolderRepository,
  ) { }

  async findAll(): Promise<TargetHolderReadDto[]> {
    const targetHolders = await this.targetHolderRepository.find({
      relations: ['post', 'target'],
    });

    return targetHolders.map((targetHolder) => ({
      id: targetHolder.id,
      createdAt: targetHolder.createdAt,
      updatedAt: targetHolder.updatedAt,
      target: targetHolder.target,
      post: targetHolder.post,
    }));
  }


  async create(targetHolderCreateDto: TargetHolderCreateDto): Promise<void> {
    try {
      const targetHolder = new TargetHolder();
      targetHolder.target = targetHolderCreateDto.target;
      targetHolder.post = targetHolderCreateDto.post;

      await this.targetHolderRepository.insert(targetHolder);
    } catch (err) {
      throw new InternalServerErrorException(
        'Ошибка при создании ответственного за задачу',
      );
    }
  }

  async createBulk(targetHolderCreateDtos: TargetHolderCreateDto[]): Promise<void> {
    try {
      const targetHolders: TargetHolder[] = [];
      targetHolderCreateDtos.forEach((targetHolderCreateDto, index) => {
        targetHolders[index].target = targetHolderCreateDto.target;
        targetHolders[index].post = targetHolderCreateDto.post;
      })
      await this.targetHolderRepository.insert(targetHolders);
    } catch (err) {
      throw new InternalServerErrorException(
        'Ошибка при создании ответственного за задачу',
      );
    }
  }



  async remove(target: TargetReadDto): Promise<void> {
    await this.targetHolderRepository.delete({ target: target });
  }
}
