import { FormControl } from '@angular/forms';
import { isNumericValidator } from './numeric.validator';

describe('isNumericValidator', () => {
  it('should validate a numeric input', () => {
    expect(
      isNumericValidator()(new FormControl<string>('123'))
    ).toBeUndefined();

    expect(isNumericValidator()(new FormControl<string>('0'))).toBeUndefined();

    expect(
      isNumericValidator()(new FormControl<string>('1234567890'))
    ).toBeUndefined();
  });

  it('should NOT validate a NON-numeric input', () => {
    expect(isNumericValidator()(new FormControl<string>('123ABC'))).toEqual({
      error: true,
      customMessage: 'Enter a valid number',
    });

    expect(isNumericValidator()(new FormControl<string>('123ABC123'))).toEqual({
      error: true,
      customMessage: 'Enter a valid number',
    });

    expect(isNumericValidator()(new FormControl<string>('ABC'))).toEqual({
      error: true,
      customMessage: 'Enter a valid number',
    });

    expect(isNumericValidator()(new FormControl<string>(''))).toEqual({
      error: true,
      customMessage: 'Enter a valid number',
    });

    expect(isNumericValidator()(new FormControl<string>(null))).toEqual({
      error: true,
      customMessage: 'Enter a valid number',
    });
  });
});
