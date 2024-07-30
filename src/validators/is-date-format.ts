import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          if (!regex.test(value)) return false;
          const date = new Date(value);
          return (
            !isNaN(date.getTime()) && value === date.toISOString().split('T')[0]
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in the format YYYY-MM-DD`;
        },
      },
    });
  };
}
