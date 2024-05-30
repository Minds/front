import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for numeric input.
 * @returns { ValidatorFn } Validator function.
 */
export function isNumericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!/^[0-9]+$/.test(control.value)) {
      return {
        error: true,
        customMessage: 'Enter a valid number',
      };
    }
  };
}
