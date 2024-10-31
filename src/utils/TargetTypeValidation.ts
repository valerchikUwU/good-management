import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { TargetCreateDto } from 'src/contracts/target/create-target.dto';

export function HasProductAndRegularTasks(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'HasProductAndRegularTasks',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: TargetCreateDto[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          const hasProductTask = value.some(task => task.type === 'Продукт');
          const hasRegularTask = value.some(task => task.type === 'Обычная');

          return hasProductTask && hasRegularTask;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Массив targetCreateDtos должен содержать хотя бы одну задачу с типом "Продукт" и одну с типом "Обычная".';
        },
      },
    });
  };
}
