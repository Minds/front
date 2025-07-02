import { Pipe } from '@angular/core';
import addressExcerpt from '../../helpers/address-excerpt';

@Pipe({
  name: 'addressExcerpt',
  standalone: false,
})
export class AddressExcerptPipe {
  transform(value: string, uppercase: boolean = false) {
    return addressExcerpt(uppercase ? value.toUpperCase() : value);
  }
}
