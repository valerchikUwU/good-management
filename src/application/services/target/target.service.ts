import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Target } from "src/domains/target.entity";
import { TargetRepository } from "./repository/target.repository";
import { TargetReadDto } from "src/contracts/target/read-target.dto";
import { TargetCreateDto } from "src/contracts/target/create-target.dto";
import { TargetHolderService } from "../targetHolder/targetHolder.service";
import { UsersService } from "../users/users.service";
import { TargetHolderCreateDto } from "src/contracts/targetHolder/create-targetHolder.dto";
import { TargetUpdateDto } from "src/contracts/target/update-target.dto";
import { Logger } from "winston";



@Injectable()
export class TargetService {
    constructor(
        @InjectRepository(Target)
        private readonly targetRepository: TargetRepository,
        private readonly targetHolderService: TargetHolderService,
        private readonly userService: UsersService,
        @Inject('winston') private readonly logger: Logger,
    ) {

    }

    async findAll(): Promise<TargetReadDto[]> {
        try {
        const targets = await this.targetRepository.find();

        return targets.map(target => ({
            id: target.id,
            type: target.type,
            orderNumber: target.orderNumber,
            content: target.content,
            dateStart: target.dateStart,
            deadline: target.deadline,
            dateComplete: target.dateComplete,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,
            targetHolders: target.targetHolders,
            project: target.project,
        }))
    }
    catch (err) {

        this.logger.error(err);
        // Обработка других ошибок
        throw new InternalServerErrorException('Ошибка при получении всех задач!');
    }
    }

    async findeOneById(id: string): Promise<TargetReadDto | null> {
        try {
        const target = await this.targetRepository.findOneBy({ id });

        if (!target) throw new NotFoundException(`Задача с ID: ${id} не найдена!`);
        const targetReadDto: TargetReadDto = {
            id: target.id,
            type: target.type,
            orderNumber: target.orderNumber,
            content: target.content,
            dateStart: target.dateStart,
            deadline: target.deadline,
            dateComplete: target.dateComplete,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,
            targetHolders: target.targetHolders,
            project: target.project,
        }

        return targetReadDto;
    }
    catch (err) {

        this.logger.error(err);
        // Обработка специфичных исключений
        if (err instanceof NotFoundException) {
            throw err; // Пробрасываем исключение дальше
        }

        // Обработка других ошибок
        throw new InternalServerErrorException('Ошибка при получении задачи');
    }
    }

    async create(targetCreateDto: TargetCreateDto): Promise<Target> {
        try {
            // Проверка на наличие обязательных данных

            if (!targetCreateDto.type) {
                throw new BadRequestException('Выберите тип задачи!');
            }
            if (!targetCreateDto.content) {
                throw new BadRequestException('Задача не может быть пустой!');
            }
            if (!targetCreateDto.holderUserId) {
                throw new BadRequestException('Выберите ответственного за задачу!');
            }
            const target = new Target();
            target.type = targetCreateDto.type;
            target.orderNumber = targetCreateDto.orderNumber;
            target.content = targetCreateDto.content;
            target.holderUserId = targetCreateDto.holderUserId
            target.dateStart = new Date();
            target.deadline = targetCreateDto.deadline;
            target.project = targetCreateDto.project;
            const createdTarget = await this.targetRepository.save(target);
            const targetHolderCreateDto: TargetHolderCreateDto = {
                target: createdTarget,
                user: targetCreateDto.holderUser
            }
            await this.targetHolderService.create(targetHolderCreateDto)
            return createdTarget;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при создании задачи');
        }
    }

    async update(updateTargetDto: TargetUpdateDto): Promise<TargetReadDto> {
        try {
            const target = await this.targetRepository.findOne({ where: { id: updateTargetDto._id } });
            if (!target) {
                throw new NotFoundException(`Задача с ID ${updateTargetDto._id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateTargetDto.content) target.content = updateTargetDto.content;
            if (updateTargetDto.holderUserId) {
                const holderUser = await this.userService.findOne(updateTargetDto.holderUserId);
                const targetHolderCreateDto: TargetHolderCreateDto = {
                    target: target,
                    user: holderUser
                }
                await this.targetHolderService.create(targetHolderCreateDto);
                target.holderUserId = updateTargetDto.holderUserId;
            }
            if (updateTargetDto.dateStart) target.dateStart = updateTargetDto.dateStart;
            if (updateTargetDto.deadline) target.deadline = updateTargetDto.deadline;

            return this.targetRepository.save(target);
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении задачи');
        }

    }
}