import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleSettingService } from 'src/application/services/roleSetting/roleSetting.service';
import { RoleSettingReadDto } from 'src/contracts/roleSetting/read-roleSetting.dto';
import { Actions, Modules, RoleSetting } from 'src/domains/roleSetting.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleSettingService: RoleSettingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Предполагается, что пользователь уже аутентифицирован и доступен
    if (user.role.roleName === 'Собственник') {
      return true;
    }
    // Получаем модуль и действие из метаданных
    const module: Modules = this.reflector.get<Modules>(
      'module',
      context.getHandler(),
    );
    const action: Actions = this.reflector.get<Actions>(
      'action',
      context.getHandler(),
    );

    if (!module || !action) {
      return false; // Если модуль или действие не указаны, доступ запрещён
    }

    // Получаем настройки роли пользователя
    const roleSetting = await this.roleSettingService.findByRoleAndModule(
      user.role.id,
      module,
    );

    // Проверяем, есть ли у роли доступ к модулю и разрешено ли выполнять действие
    const hasPermission = this.checkPermission(roleSetting, module, action);

    if (!hasPermission) {
      throw new ForbiddenException(
        'У вас нет прав для выполнения этого действия',
      );
    }

    return true;
  }

  // Логика проверки разрешений
  private checkPermission(
    roleSettings: RoleSettingReadDto,
    module: Modules,
    action: Actions,
  ): boolean {
    if (!roleSettings || roleSettings.module !== module) return false;

    switch (action) {
      case Actions.READ:
        return roleSettings.can_read;
      case Actions.CREATE:
        return roleSettings.can_create;
      case Actions.UPDATE:
        return roleSettings.can_update;
      default:
        return false;
    }
  }
}
