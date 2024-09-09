import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotEmpty', async: false })
export class HasAtLeastOneFieldConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;
    const keys = Object.keys(object).filter((key) => key !== '_');
    if (keys.length < Object.keys(object).length) return false;
    return keys.some(
      (key) =>
        object[key] !== null && object[key] !== undefined && object[key] !== ''
    );
  }

  defaultMessage() {
    return 'At least one property must be provided';
  }
}
