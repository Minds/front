// import {
//   async,
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
// } from '@angular/core/testing';

// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MaterialMock } from '../../../../tests/material-mock.spec';
// import { PhoneInputV2Component } from './phone-input-v2.component';
// import { PhoneInputCountryV2Component } from './country.component';
// import { DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';

// describe('PhoneInputV2Component', () => {
//   let comp: PhoneInputV2Component;
//   let fixture: ComponentFixture<PhoneInputV2Component>;

//   function getInput(): DebugElement {
//     return fixture.debugElement.query(By.css('input'));
//   }

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         MaterialMock,
//         PhoneInputV2Component,
//         PhoneInputCountryV2Component,
//       ], // declare the test component
//       imports: [ReactiveFormsModule, FormsModule],
//     }).compileComponents(); // compile template and css
//   }));

//   // synchronous beforeEach
//   beforeEach(() => {
//     fixture = TestBed.createComponent(PhoneInputV2Component);

//     comp = fixture.componentInstance; // LoginForm test instance

//     fixture.detectChanges();
//   });

//   it('should have a phone input', fakeAsync(() => {
//     expect(getInput()).not.toBeNull();
//   }));

//   it('should set a phone number', () => {
//     getInput().nativeElement.value = '0123456789';
//     getInput().nativeElement.dispatchEvent(new Event('input'));

//     expect(comp.number).toEqual('10123456789');
//   });
// });
