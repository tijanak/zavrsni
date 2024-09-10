import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxImageAmount(maxAmount: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length <= maxAmount) {
      return null;
    }
    return {
      maxImageAmount: {
        requiredLength: maxAmount,
        actualLength: control.value?.length || 0,
      },
    };
  };
}
