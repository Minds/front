import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CaptchaComponent, Captcha } from './captcha.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../services/api';
import { clientMock } from '../../../tests/client-mock.spec';
import { By } from '@angular/platform-browser';

describe('CaptchaComponent', () => {
  let comp: CaptchaComponent;
  let fixture: ComponentFixture<CaptchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaptchaComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: Client, useValue: clientMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    clientMock.response = {};
  });
});
