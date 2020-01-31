import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
} from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Country } from './country';
import { CountryCode } from './countries';
import * as moment from 'moment';

@Component({
  selector: 'm-phoneInput__country',
  templateUrl: 'country.component.html',
})
export class PhoneInputCountryV2Component implements OnInit {
  @Input() showDropdown: boolean = false;
  @Output() toggledDropdown: EventEmitter<any> = new EventEmitter();
  @Output('country') selectedCountryEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('dropdown', { static: true }) dropdown: ElementRef;

  countries: Array<Country> = [];
  selectedCountry: Country = new Country();
  phoneNumber: string;
  countryCodeData = new CountryCode();
  selectedCountryIndex = 0;
  focusedCountryIndex = 0;

  lastKeyboardFocusMoment = moment();
  lastMouseMoveMoment = moment();

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  ngOnInit() {
    this.closeDropdown();
    this.fetchCountryData();
    this.onCountrySelect(this.selectedCountryIndex);
  }

  openDropdown() {
    this.applyFocus(this.selectedCountryIndex);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.toggledDropdown.emit({ showDropdown: true });
      }, 0);
    }
  }
  closeDropdown() {
    this.toggledDropdown.emit({ showDropdown: false });
  }

  public onCountrySelect(i: number): void {
    this.focusedCountryIndex = i;
    this.selectedCountryIndex = i;
    this.selectedCountry = this.countries[i];
    this.selectedCountryEvt.next(this.selectedCountry);
    if (this.showDropdown) {
      this.closeDropdown();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (!this.showDropdown) {
      return;
    }
    switch ($event.key) {
      case 'ArrowDown':
        if (this.focusedCountryIndex < this.countries.length - 1) {
          this.lastKeyboardFocusMoment = moment();
          this.applyFocus(this.focusedCountryIndex + 1);
        }
        break;
      case 'ArrowUp':
        this.lastKeyboardFocusMoment = moment();
        if (this.focusedCountryIndex !== 0) {
          this.applyFocus(this.focusedCountryIndex - 1);
        }
        break;
      case 'Enter':
        $event.preventDefault();
        $event.stopPropagation();
        this.onCountrySelect(this.focusedCountryIndex);
        break;
      default:
        this.searchListByFirstLetterOfCountry($event);
        break;
    }
  }

  applyFocus(i: number) {
    this.focusedCountryIndex = i;
    const dropdownEl = this.dropdown.nativeElement;
    const countryEls = dropdownEl.querySelectorAll('.m-phoneInput__country');

    const countryEl = countryEls[i];
    countryEl.focus();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    if (this.showDropdown) {
      this.lastMouseMoveMoment = moment();
    }
  }

  onMouseEnter(i) {
    // don't let mouse position compete with keyboard controls
    // as the list scrolls
    if (
      this.lastMouseMoveMoment.valueOf() >
      this.lastKeyboardFocusMoment.valueOf()
    ) {
      this.applyFocus(i);
    }
  }

  searchListByFirstLetterOfCountry($event: KeyboardEvent) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const uppercaseKey = $event.key.toUpperCase();
    if (this.showDropdown && chars.indexOf(uppercaseKey)) {
      for (let i = 0; i < this.countries.length; ++i) {
        if (this.countries[i].name.trim()[0].toUpperCase() === uppercaseKey) {
          this.applyFocus(i);
          break;
        }
      }
    }
  }

  protected fetchCountryData(): void {
    this.countryCodeData.countries.forEach(c => {
      const country = new Country();
      country.name = c[0].toString();
      country.iso2 = c[1].toString();
      country.dialCode = c[2].toString();
      country.priority = +c[3] || 0;
      country.areaCode = +c[4] || null;
      country.flagClass = country.iso2.toLocaleLowerCase();
      this.countries.push(country);
    });
  }
}
