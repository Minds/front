import { Component, ElementRef, forwardRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Country } from './country';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountryCode } from './countries';

export const PHONE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PhoneInputComponent),
  multi: true
};

@Component({
  selector: 'm-phone-input',
  templateUrl: 'phone-input.component.html',
  providers: [PHONE_INPUT_VALUE_ACCESSOR]
})

export class PhoneInputComponent implements ControlValueAccessor, OnInit, OnChanges {

  phoneNumber: string = '';

  @ViewChild('input') input: ElementRef;
  selectedCountry;

  allowedKeyCodes: Array<number> = [8, 33, 34, 35, 36, 37, 39, 46];

  propagateChange = (_: any) => {
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  public onPhoneNumberChange(): void {
    this.propagateChange(this.number);
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && this.allowedKeyCodes.indexOf(event.keyCode) === -1) {
      event.preventDefault();
    }
  }

  get number() {
    return this.selectedCountry.dialCode + this.phoneNumber;
  }

  ngOnChanges(changes: any) {
    this.propagateChange(changes);

    console.log(this.number);
  }

  writeValue(value: any) {
    if (value && value.length > 10) {
      this.phoneNumber = value.substring(value.length - 11, value.length - 1);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

}