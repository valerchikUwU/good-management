import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { TargetCreateDto } from 'src/contracts/target/create-target.dto';
import { Type as TypeProject } from 'src/domains/project.entity';
import { State, Type } from 'src/domains/target.entity';

export function HasProductAndRegularTasksForProject(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'HasProductAndRegularTasksForProject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: TargetCreateDto[], args: ValidationArguments) {
          // Получаем объект DTO и проверяем тип
          const dto = args.object as any;
          if (dto.type !== TypeProject.PROJECT) {
            return true; // Если тип не PROJECT, пропускаем проверку
          }
          if (!Array.isArray(value)) return false;

          const hasProductTask = value.some(
            (task) => task.type === Type.PRODUCT,
          );
          const hasRegularTask = value.some(
            (task) => task.type === Type.COMMON,
          );

          return hasProductTask && hasRegularTask;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Список задач должен содержать хотя бы одну задачу с типом "Продукт" и одну с типом "Задача".';
        },
      },
    });
  };
}

export function HasProductTaskAndProjectIdsForProgram(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'HasProductTaskAndProjectIdsForProgram',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: TargetCreateDto[], args: ValidationArguments) {
          // Получаем объект DTO и проверяем тип
          const dto = args.object as any;
          if (dto.type !== TypeProject.PROGRAM) {
            return true; // Пропускаем валидацию, если тип не PROGRAM
          }

          // Проверка, что в targetCreateDtos есть задача типа "Продукт"
          const hasProductTask =
            Array.isArray(dto.targetCreateDtos) &&
            dto.targetCreateDtos.some((task) => task.type === Type.PRODUCT);

          // Проверка, что projectIds содержит хотя бы один элемент
          const hasProjectIds =
            Array.isArray(dto.projectIds) && dto.projectIds.length > 0;

          return hasProductTask && hasProjectIds;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Для программы список задач должен содержать хотя бы одну задачу с типом "Продукт", также выберите хотя бы один проект для программы!';
        },
      },
    });
  };
}

export function HasStrategyForProgram(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'HasStrategyForProgram',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: TargetCreateDto[], args: ValidationArguments) {
          // Получаем объект DTO и проверяем тип
          const dto = args.object as any;
          if (dto.type !== TypeProject.PROGRAM) {
            return true; // Пропускаем валидацию, если тип не PROGRAM
          }

          // Проверка, что в targetCreateDtos есть задача типа "Продукт"
          const hasStrategy = dto.strategyId !== undefined ? true : false;
          return hasStrategy;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Для программы обязательно нужно выбрать стратегию!';
        },
      },
    });
  };
}

export function HasCommonActiveOrFinished(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'HasCommonActiveOrFinished',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: TargetCreateDto[], args: ValidationArguments) {
          // Получаем объект DTO и проверяем тип
          const dto = args.object as any;

          // Проверка, что в targetCreateDtos есть задача типа "Продукт"
          const hasCommonInCreateDtos = Array.isArray(dto.targetCreateDtos) && dto.targetCreateDtos.some((task) => task.type === Type.COMMON)
          if (hasCommonInCreateDtos) return true
          const hasCommonInUpdateDtos =
            Array.isArray(dto.targetUpdateDtos) &&
            dto.targetUpdateDtos.some((task) => task.type === Type.COMMON && (task.targetState === State.ACTIVE || task.targetState === State.FINISHED));


          return hasCommonInUpdateDtos;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Должна быть хотя бы одна задача с типом Обычная и статусом Активная или Завершена!';
        },
      },
    });
  };
}