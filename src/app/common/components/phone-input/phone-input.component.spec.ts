import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { PhoneInputComponent } from './phone-input.component';
import { PhoneInputCountryComponent } from './country.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PhoneInputComponent', () => {
  let comp: PhoneInputComponent;
  let fixture: ComponentFixture<PhoneInputComponent>;

  function getInput(): DebugElement {
    return fixture.debugElement.query(By.css('input'));
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        PhoneInputComponent,
        PhoneInputCountryComponent,
      ], // declare the test component
      imports: [ReactiveFormsModule, FormsModule],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneInputComponent);

    comp = fixture.componentInstance; // LoginForm test instance

    fixture.detectChanges();
  });

  it('should have a phone input', fakeAsync(() => {
    expect(getInput()).not.toBeNull();
  }));

  it('should set a phone number', () => {
    getInput().nativeElement.value = '0123456789';
    getInput().nativeElement.dispatchEvent(new Event('input'));

    expect(comp.number).toEqual('10123456789');
  });
});
