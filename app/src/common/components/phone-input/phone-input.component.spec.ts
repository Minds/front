import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { PhoneInputComponent } from './phone-input.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PhoneInputComponent', () => {

  let comp: PhoneInputComponent;
  let fixture: ComponentFixture<PhoneInputComponent>;

  function getSelectedFlagButton(): DebugElement {
    return fixture.debugElement.query(By.css('.selected-flag'));
  }

  function getFlagDropdown(): DebugElement {
    return fixture.debugElement.query(By.css('ul.country-list.dropdown-menu'));
  }

  function getFlagItem(i: number = 0): DebugElement {
    return fixture.debugElement.query(By.css(`ul.country-list > li:nth-child(${i})`));
  }

  function getInput(): DebugElement {
    return fixture.debugElement.query(By.css('input'));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, PhoneInputComponent], // declare the test component
      imports: [ReactiveFormsModule, FormsModule],
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneInputComponent);

    comp = fixture.componentInstance; // LoginForm test instance

    fixture.detectChanges();
  });

  it('should have a flag button', fakeAsync(() => {
    expect(getSelectedFlagButton()).not.toBeNull();
  }));
  it('flag button should have a flag and an arrow', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('.selected-flag > .flag'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.selected-flag > .arrow'))).not.toBeNull();
  }));
  it('should have a flag button', fakeAsync(() => {
    expect(getSelectedFlagButton()).not.toBeNull();
  }));

  it('should have a phone input', fakeAsync(() => {
    expect(getInput()).not.toBeNull();
  }));

  it('should have a hidden dropdown list', fakeAsync(() => {
    expect(getFlagDropdown()).not.toBeNull();
  }));

  it('dropdown list should have a list of countries', fakeAsync(() => {
    const selector = 'ul.country-list > .country';
    const flag = fixture.debugElement.query(By.css(selector + ' > .flag-box'));
    const countryName = fixture.debugElement.query(By.css(selector + ' > .country-name'));
    const dialCode = fixture.debugElement.query(By.css(selector + ' > .dial-code'));

    expect(flag).not.toBeNull();
    expect(countryName).not.toBeNull();
    expect(dialCode).not.toBeNull();
  }));

  it('clicking on flag button should open the dropdown list', fakeAsync(() => {
    getSelectedFlagButton().nativeElement.click();
    fixture.detectChanges();
    expect(getFlagDropdown().nativeElement.hidden).toBeFalsy();
  }));

  it('clicking on a country should close the dropdown', fakeAsync(() => {
    getSelectedFlagButton().nativeElement.click();
    fixture.detectChanges();

    getFlagItem(1).nativeElement.click();
    fixture.detectChanges();

    expect(getFlagDropdown().nativeElement.hidden).toBeTruthy();

    expect(comp.selectedCountry).not.toBeNull();
  }));

  it('should set a phone number', () => {
    getSelectedFlagButton().nativeElement.click();
    fixture.detectChanges();
    getFlagItem(1).nativeElement.click();
    fixture.detectChanges();

    getInput().nativeElement.value = '0123456789';
    getInput().nativeElement.dispatchEvent(new Event('input'));

    expect(comp.getCompletePhoneNumber()).toEqual('930123456789');
  });

});