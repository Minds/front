import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { verticallyScrollElementIntoView } from '../../../helpers/scrollable-container-visibility';

import { Country } from './country';
import { CountryCode } from './countries';
import * as moment from 'moment';

export type CountrySelectedEvent = {
  number: Country;
  emit: boolean;
};

@Component({
  selector: 'm-phoneInput__country',
  templateUrl: 'country.component.html',
})
export class PhoneInputCountryV2Component
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() disabled: boolean = false;
  @Input() showDropdown: boolean = false;
  @Input() initCountryCode: string;
  @Input() allowedCountries: string[];
  @Output() toggledDropdown: EventEmitter<any> = new EventEmitter();
  @Output() countrySelected: EventEmitter<CountrySelectedEvent> =
    new EventEmitter<CountrySelectedEvent>();

  @ViewChild('input') input: ElementRef;
  @ViewChild('dropdown', { static: true }) dropdown: ElementRef;
  @ViewChildren('countryEl') countryElsList: QueryList<ElementRef>;

  countries: Array<Country> = [];
  countryEls;
  selectedCountry: Country = new Country();
  phoneNumber: string;
  countryCodeData = new CountryCode();
  selectedCountryIndex = 0;
  focusedCountryIndex = 0;
  toggleTimeout;
  scrollTimeout;

  lastKeyboardFocusMoment = moment();
  lastMouseMoveMoment = moment();

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  ngOnInit() {
    this.closeDropdown();

    this.fetchCountryData();
    if (this.initCountryCode) {
      this.setInitCountry();
    }

    this.onCountrySelect(this.selectedCountryIndex, false);
  }

  ngAfterViewInit() {
    this.countryEls = this.countryElsList.toArray();
  }

  public onCountrySelect(i: number, emit: boolean = true): void {
    this.focusedCountryIndex = i;
    this.selectedCountryIndex = i;
    this.selectedCountry = this.countries[i];
    this.countrySelected.next({ number: this.selectedCountry, emit: emit });
    if (this.showDropdown) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    if (this.disabled) {
      return;
    }

    this.applyFocus(this.selectedCountryIndex);
    if (isPlatformBrowser(this.platformId)) {
      this.toggleTimeout = setTimeout(() => {
        this.toggledDropdown.emit({ showDropdown: true });
      }, 0);
      this.scrollTimeout = setTimeout(() => {
        verticallyScrollElementIntoView(
          this.dropdown.nativeElement,
          this.countryEls[this.selectedCountryIndex].nativeElement
        );
      }, 1);
    }
  }

  closeDropdown() {
    this.toggledDropdown.emit({ showDropdown: false });
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

    const countryEl = this.countryEls[i];

    countryEl.nativeElement.focus();
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
      this.lastKeyboardFocusMoment = moment();
      for (let i = 0; i < this.countries.length; ++i) {
        if (this.countries[i].name.trim()[0].toUpperCase() === uppercaseKey) {
          this.applyFocus(i);
          break;
        }
      }
    }
  }

  countryIsAllowed(iso2) {
    return this.allowedCountries.indexOf(iso2) > -1;
  }

  protected fetchCountryData(): void {
    for (let i = 0; i < this.allowedCountries.length; i++) {
      this.allowedCountries[i] = this.allowedCountries[i].toLowerCase();
    }

    this.countryCodeData.countries.forEach((c) => {
      if (
        this.allowedCountries.length === 0 ||
        this.countryIsAllowed(c[1].toString())
      ) {
        this.pushCountry(c);
      }
    });
  }

  pushCountry(c) {
    const country = new Country();
    country.name = c[0].toString();
    country.iso2 = c[1].toString();
    country.dialCode = c[2].toString();
    country.priority = +c[3] || 0;
    country.areaCode = +c[4] || null;
    country.flagClass = country.iso2.toLocaleLowerCase();
    this.countries.push(country);
  }

  setInitCountry() {
    this.initCountryCode = this.initCountryCode.toLowerCase();

    const initCountryIndex = this.countries.findIndex((c) => {
      return this.initCountryCode === c.iso2;
    });
    if (initCountryIndex > -1) {
      this.selectedCountryIndex = initCountryIndex;
    }
  }

  ngOnDestroy() {
    if (this.toggleTimeout) {
      clearTimeout(this.toggleTimeout);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}
