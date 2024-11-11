import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { RoleRepository } from './repository/role.repository';
import { Role, Roles } from 'src/domains/role.entity';
import { RoleReadDto } from 'src/contracts/role/read-role.dto';
import { Not } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: RoleRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAll(): Promise<RoleReadDto[]> {
    const roles = await this.roleRepository.find({
      where: { roleName: Not(Roles.OWNER) },
    });
    return roles.map((role) => ({
      id: role.id,
      roleName: role.roleName,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      roleSettings: role.roleSettings,
      users: role.users,
      // Добавьте любые другие поля, которые должны быть включены в ответ
    }));
  }

  async findOneById(id: string): Promise<RoleReadDto> {
    try {
      const role = await this.roleRepository.findOne({ where: { id: id } });

      if (!role) throw new NotFoundException(`Роль с ID: ${id} не найдена`);
      const roleReadDto: RoleReadDto = {
        id: role.id,
        roleName: role.roleName,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        roleSettings: role.roleSettings,
        users: role.users,
      };

      return roleReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении роли');
    }
  }

  async findOneByName(roleName: Roles): Promise<RoleReadDto> {
    try {
      const role = await this.roleRepository.findOne({
        where: { roleName: roleName },
      });

      if (!role) throw new NotFoundException(`Роль с OWNER не найдена`);
      const roleReadDto: RoleReadDto = {
        id: role.id,
        roleName: role.roleName,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        roleSettings: role.roleSettings,
        users: role.users,
      };

      return roleReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении роли');
    }
  }
}
