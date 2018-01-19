import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { PhoneInputCountryComponent } from './country.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PhoneInputCountryComponent', () => {

  let comp: PhoneInputCountryComponent;
  let fixture: ComponentFixture<PhoneInputCountryComponent>;

  function getSelectedFlagButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-phone-input--selected-flag'));
  }

  function getFlagDropdown(): DebugElement {
    return fixture.debugElement.query(By.css('ul.m-phone-input--country-list.dropdown-menu'));
  }

  function getFlagItem(i: number = 0): DebugElement {
    return fixture.debugElement.query(By.css(`ul.m-phone-input--country-list > li:nth-child(${i})`));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, PhoneInputCountryComponent], // declare the test component
      imports: [ReactiveFormsModule, FormsModule],
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneInputCountryComponent);

    comp = fixture.componentInstance; // LoginForm test instance

    fixture.detectChanges();
  });

  it('should have a flag button', fakeAsync(() => {
    expect(getSelectedFlagButton()).not.toBeNull();
  }));
  it('flag button should have a flag and an arrow', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('.m-phone-input--selected-flag > .m-phone-input--flag'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.m-phone-input--selected-flag > .m-phone-input--arrow'))).not.toBeNull();
  }));
  it('should have a flag button', fakeAsync(() => {
    expect(getSelectedFlagButton()).not.toBeNull();
  }));

  it('should have a hidden dropdown list', fakeAsync(() => {
    expect(getFlagDropdown()).not.toBeNull();
  }));

  it('dropdown list should have a list of countries', fakeAsync(() => {
    const selector = 'ul.m-phone-input--country-list > .m-phone-input--country';
    const flag = fixture.debugElement.query(By.css(selector + ' > .m-phone-input--flag-box'));
    const countryName = fixture.debugElement.query(By.css(selector + ' > .m-phone-input--country-name'));
    const dialCode = fixture.debugElement.query(By.css(selector + ' > .m-phone-input--dial-code'));

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

});