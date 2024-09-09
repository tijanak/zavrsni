import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function exceptionFactory(
  validationErrors: ValidationError[]
): BadRequestException {
  const firstError = validationErrors[0];
  const errorMessage = firstError.constraints
    ? Object.values(firstError.constraints).join(', ')
    : 'Nevalidno';

  return new BadRequestException({
    statusCode: 400,
    message: errorMessage,
    error: 'Bad Request',
  });
}
