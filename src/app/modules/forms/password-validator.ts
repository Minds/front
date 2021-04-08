import { AbstractControl, ValidationErrors } from '@angular/forms';

export const PASSWORD_VALIDATOR_LENGTH_CHECK = (str: string) => str.length >= 8;
export const PASSWORD_VALIDATOR_SPECIAL_CHAR_CHECK = (str: string) =>
  /[^a-zA-Z\d]/.exec(str) !== null;
export const PASSWORD_VALIDATOR_MIXED_CASE_CHECK = (str: string) =>
  /[a-z]/.exec(str) !== null && /[A-Z]/.exec(str) !== null;
export const PASSWORD_VALIDATOR_NUMBERS_CHECK = (str: string) =>
  /\d/.exec(str) !== null;
export const PASSWORD_VALIDATOR_SPACES_CHECK = (str: string) =>
  /\s/.exec(str) === null;

export const PASSWORD_VALIDATOR = (
  control: AbstractControl
): ValidationErrors | null => {
  const str = control.value;
  const lengthCheck = PASSWORD_VALIDATOR_LENGTH_CHECK(str);
  const specialCharCheck = PASSWORD_VALIDATOR_SPECIAL_CHAR_CHECK(str);
  const mixedCaseCheck = PASSWORD_VALIDATOR_MIXED_CASE_CHECK(str);
  const numbersCheck = PASSWORD_VALIDATOR_NUMBERS_CHECK(str);
  const spacesCheck = PASSWORD_VALIDATOR_SPACES_CHECK(str);

  const validated =
    lengthCheck &&
    specialCharCheck &&
    mixedCaseCheck &&
    numbersCheck &&
    spacesCheck;
  return !validated
    ? {
        invalidPassword: {
          lengthCheck,
          specialCharCheck,
          mixedCaseCheck,
          numbersCheck,
          spacesCheck,
        },
      }
    : null;
};
