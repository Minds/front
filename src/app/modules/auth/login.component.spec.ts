import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { MaterialMock } from '../../../tests/material-mock.spec';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { clientMock } from '../../../tests/client-mock.spec';
import { Client } from '../../services/api/client';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { loginReferrerServiceMock } from '../../mocks/services/login-referrer-service-mock.spec';
import { onboardingServiceMock } from '../../mocks/modules/onboarding/onboarding.service.mock.spec';
import { OnboardingService } from '../onboarding/onboarding.service';
import { MindsTitle } from '../../services/ux/title';
import { mindsTitleMock } from '../../mocks/services/ux/minds-title.service.mock.spec';
import { signupModalServiceMock } from '../../mocks/modules/modals/signup/signup-modal-service.mock';
import { SignupModalService } from '../modals/signup/service';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'minds-form-login',
  template: ''
})
class MindsFormLoginMock {
  @Output() done: EventEmitter<any> = new EventEmitter<any>();
  @Output() doneRegistered: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'minds-form-register',
  template: ''
})
class MindsFormRegisterMock {
  @Input() referrer: string;
  @Output() done: EventEmitter<any> = new EventEmitter<any>();
}

describe('LoginComponent', () => {

  let comp: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, MindsFormLoginMock, MindsFormRegisterMock, LoginComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, CommonModule, FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
        { provide: OnboardingService, useValue: onboardingServiceMock },
        { provide: MindsTitle, useValue: mindsTitleMock },
        { provide: SignupModalService, useValue: signupModalServiceMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().install();

    fixture = TestBed.createComponent(LoginComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => done());
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a login form', () => {
    const h3: DebugElement = fixture.debugElement.query(By.css('.m-login div:first-child h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.textContent).toContain('Login to Minds');

    expect(fixture.debugElement.query(By.css('minds-form-login'))).not.toBeNull();
  });

  it('should have a register form', () => {
    const h3: DebugElement = fixture.debugElement.query(By.css('.m-login div:last-child h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.textContent).toContain('Not on Minds? Start a channel');
    expect(fixture.debugElement.query(By.css('minds-form-register'))).not.toBeNull();
  });

  it('should redirect after logging in', () => {
    expect(loginReferrerServiceMock.navigate).toHaveBeenCalled();
  });

  it('should redirect after registering', () => {
    comp.registered();
    expect(onboardingServiceMock.show).toHaveBeenCalled();
    expect(signupModalServiceMock.setDisplay).toHaveBeenCalled();
    expect(signupModalServiceMock.setDisplay.calls.mostRecent().args[0]).toBe('categories');
    expect(signupModalServiceMock.open).toHaveBeenCalled();
    expect(loginReferrerServiceMock.navigate).toHaveBeenCalled();
    expect(loginReferrerServiceMock.navigate.calls.mostRecent().args[0]).toEqual({ defaultUrl: '/test;onboarding=1' });
  });

});
