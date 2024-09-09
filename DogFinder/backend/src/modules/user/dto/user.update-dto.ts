import { OmitType, PartialType } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { CreateUserDto } from './user.create-dto';
import { HasAtLeastOneFieldConstraint } from 'backend/src/validation/validators/has-at-least-one-field';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const)
) {
  @Validate(HasAtLeastOneFieldConstraint)
  _?: any;
}
