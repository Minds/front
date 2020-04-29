import {
  Component,
  ElementRef,
  forwardRef,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Country } from './country';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountryCode } from './countries';

@Component({
  selector: 'm-phone-input--country',
  templateUrl: 'country.component.html',
})
export class PhoneInputCountryComponent implements OnInit {
  @Output('country') selectedCountryEvt = new EventEmitter();
  countries: Array<Country> = [];
  selectedCountry: Country = new Country();
  phoneNumber: string;
  countryCodeData = new CountryCode();

  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('dropdownMenu', { static: true }) dropdownMenu: ElementRef;

  showDropdownMenu: boolean = false;
  allowedKeyCodes: Array<number> = [8, 33, 34, 35, 36, 37, 39, 46];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.fetchCountryData();
    this.selectedCountry = this.countries[0];
    this.selectedCountryEvt.next(this.selectedCountry);
  }

  searchList(event: KeyboardEvent) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const uppercaseKey = event.key.toUpperCase();
    if (this.showDropdownMenu && chars.indexOf(uppercaseKey)) {
      let items = this.dropdownMenu.nativeElement.querySelectorAll('.country');

      for (let i: number = 0; i < items.length; ++i) {
        if (
          items[i].children[1].innerText.trim()[0].toUpperCase() ===
          uppercaseKey
        ) {
          this.dropdownMenu.nativeElement.scrollTop = items[i].offsetTop;
          break;
        }
      }
    }
  }

  public onCountrySelect(country: Country): void {
    this.selectedCountry = country;
    this.toggleDropdown();
    this.selectedCountryEvt.next(country);
  }

  toggleDropdown() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  protected fetchCountryData(): void {
    this.countryCodeData.countries.forEach(c => {
      let country = new Country();
      country.name = c[0].toString();
      country.iso2 = c[1].toString();
      country.dialCode = c[2].toString();
      country.priority = +c[3] || 0;
      country.areaCode = +c[4] || null;
      country.flagClass = country.iso2.toLocaleLowerCase();
      // country.placeHolder = this.getPhoneNumberPlaceHolder(country.iso2.toUpperCase());
      this.countries.push(country);
    });
  }
}
