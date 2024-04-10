import {
  Component,
  ElementRef,
  forwardRef,
  OnChanges,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountrySelectedEvent } from './country.component';

export const PHONE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PhoneInputV2Component),
  multi: true,
};

@Component({
  selector: 'm-phoneInput',
  templateUrl: 'phone-input-v2.component.html',
  providers: [PHONE_INPUT_VALUE_ACCESSOR],
})
export class PhoneInputV2Component
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy
{
  @Input() disabled: boolean = false;
  @Input() invalid: boolean = false;
  @Input() initCountryCode: string = '';
  @Input() allowedCountries: string[] = [];

  phoneNumber: string = '';
  showDropdown: boolean = false;
  inputFocused: boolean = false;

  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  @ViewChild('input', { static: true }) input: ElementRef;
  selectedCountry;
  init: boolean = false;
  dirty: boolean = false;

  propagateChange = (_: any) => {};

  constructor() {}

  ngOnInit() {}

  countrySelected(event: CountrySelectedEvent) {
    this.selectedCountry = event.number;

    if (event.emit) {
      this.onPhoneNumberChange();
    }

    if (this.init) {
      this.input.nativeElement.focus();
      this.inputFocused = true;
    }
    this.init = true;
  }

  public onPhoneNumberChange(): void {
    this.dirty = this.phoneNumber.length !== 0;
    this.propagateChange(this.number);
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedKeyCodes: Array<number> = [8, 33, 34, 35, 36, 37, 39, 46];
    const pattern = /[0-9\+\-\ ]/,
      inputChar = String.fromCharCode(event.charCode);
    if (
      !pattern.test(inputChar) &&
      allowedKeyCodes.indexOf(event.keyCode) === -1
    ) {
      event.preventDefault();
    }
  }

  get number() {
    return this.selectedCountry.dialCode + this.phoneNumber;
  }

  writeValue(value: any) {
    if (value && value.length > 10) {
      this.phoneNumber = value.substring(value.length - 11, value.length - 1);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}

  toggledDropdown($event) {
    this.showDropdown = $event.showDropdown;
  }

  clickedInput($event) {
    $event.stopPropagation();
    this.inputFocused = true;
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  clickedAnywhere($event) {
    this.showDropdown = false;
  }

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  ngOnDestroy() {
    this.showDropdown = false;
  }
}
