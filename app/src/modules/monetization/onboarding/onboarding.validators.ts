import { ValidatorFn, AbstractControl } from '@angular/forms';

const _isCountry = (currentCountry, countries: string[]) => {
  return countries.indexOf(currentCountry) > -1;
};

export function requiredFor(countryCodes: string[], { ignore = false }: { ignore?: boolean } = {}): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (ignore) {
      return null;
    }

    const country = control.root.get('country');

    if (!country) {
      return { required: true };
    }

    const selected = country.value;

    if (!_isCountry(selected, countryCodes)) {
      return null;
    }

    return !control.value ? { required: true } : null;
  };
}

export function optionalFor(countryCodes: string[], { ignore = false }: { ignore?: boolean } = {}): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (ignore) {
      return null;
    }

    const country = control.root.get('country');

    if (!country) {
      return { required: true };
    }

    const selected = country.value;

    if (_isCountry(selected, countryCodes)) {
      return null;
    }

    return !control.value ? { required: true } : null;
  };
}
