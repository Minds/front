// import {
//   async,
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
// } from '@angular/core/testing';

// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MaterialMock } from '../../../../tests/material-mock.spec';
// import { PhoneInputCountryV2Component } from './country.component';
// import { DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';

// describe('PhoneInputCountryV2Component', () => {
//   let comp: PhoneInputCountryV2Component;
//   let fixture: ComponentFixture<PhoneInputCountryV2Component>;

//   function getSelectedFlagButton(): DebugElement {
//     return fixture.debugElement.query(By.css('.m-phoneInput__selectedFlag'));
//   }

//   function getFlagDropdown(): DebugElement {
//     return fixture.debugElement.query(
//       By.css('ul.m-phoneInput__countryList.dropdown')
//     );
//   }

//   function getFlagItem(i: number = 0): DebugElement {
//     return fixture.debugElement.query(
//       By.css(`ul.m-phoneInput__countryList > li:nth-child(${i})`)
//     );
//   }

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [MaterialMock, PhoneInputCountryV2Component], // declare the test component
//       imports: [ReactiveFormsModule, FormsModule],
//     }).compileComponents(); // compile template and css
//   }));

//   // synchronous beforeEach
//   beforeEach(() => {
//     fixture = TestBed.createComponent(PhoneInputCountryV2Component);

//     comp = fixture.componentInstance; // LoginForm test instance

//     fixture.detectChanges();
//   });

//   it('should have a flag button', fakeAsync(() => {
//     expect(getSelectedFlagButton()).not.toBeNull();
//   }));
//   it('flag button should have a flag and an arrow', fakeAsync(() => {
//     expect(
//       fixture.debugElement.query(
//         By.css('.m-phoneInput__selectedFlag > .m-phoneInput__flag')
//       )
//     ).not.toBeNull();
//     expect(
//       fixture.debugElement.query(
//         By.css('.m-phoneInput__selectedFlag > .m-phoneInput__arrow')
//       )
//     ).not.toBeNull();
//   }));

//   it('should have a hidden dropdown list', fakeAsync(() => {
//     expect(getFlagDropdown()).not.toBeNull();
//   }));

//   it('dropdown list should have a list of countries', fakeAsync(() => {
//     const selector = 'ul.m-phoneInput__countryList > .m-phoneInput__country';
//     const flag = fixture.debugElement.query(
//       By.css(selector + ' > .m-phoneInput__flagBox')
//     );
//     const countryName = fixture.debugElement.query(
//       By.css(selector + ' > .m-phoneInput__countryName')
//     );
//     const dialCode = fixture.debugElement.query(
//       By.css(selector + ' > .m-phoneInput__dialCode')
//     );

//     expect(flag).not.toBeNull();
//     expect(countryName).not.toBeNull();
//     expect(dialCode).not.toBeNull();
//   }));

//   it('clicking on flag button should open the dropdown list', fakeAsync(() => {
//     getSelectedFlagButton().nativeElement.click();
//     fixture.detectChanges();
//     expect(getFlagDropdown().nativeElement.hidden).toBeFalsy();
//   }));

//   it('clicking on a country should close the dropdown', fakeAsync(() => {
//     getSelectedFlagButton().nativeElement.click();
//     fixture.detectChanges();

//     getFlagItem(1).nativeElement.click();
//     fixture.detectChanges();

//     expect(getFlagDropdown().nativeElement.hidden).toBeTruthy();

//     expect(comp.selectedCountry).not.toBeNull();
//   }));
// });
