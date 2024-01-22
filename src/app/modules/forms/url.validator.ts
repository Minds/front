import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Uses URL constructor to validate url inputs
 * (It's not perfect)
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // If control is empty, return no error
      return null;
    }

    try {
      // Attempt to construct a new URL object with the input value
      new URL(control.value);
      // It's valid, so no errors
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}
