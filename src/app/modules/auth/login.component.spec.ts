import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

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
import { signupModalServiceMock } from '../../mocks/modules/modals/signup/signup-modal-service.mock';
import { SignupModalService } from '../modals/signup/service';
import { By } from '@angular/platform-browser';
import { Storage } from '../../services/storage';
import {
  CookieService,
  CookieOptionsProvider,
  COOKIE_OPTIONS,
  CookieModule,
} from '@mindsorg/ngx-universal';
import { TopbarService } from '../../common/layout/topbar.service';
import { MockService, MockComponent } from '../../utils/mock';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { LanguageBarComponent } from '../language/language-bar.component';
import { LanguageModalComponent } from '../language/language-modal/language-modal.component';
import { RedirectService } from '../../common/services/redirect.service';
import { ModalService } from '../../services/ux/modal.service';
import { modalServiceMock } from '../../../tests/modal-service-mock.spec';

@Component({
  selector: 'm-loginForm',
  template: '',
})
class MindsFormLoginMock {
  @Output() done: EventEmitter<any> = new EventEmitter<any>();
  @Output() doneRegistered: EventEmitter<any> = new EventEmitter<any>();
  @Input() showBigButton: boolean = false;
  @Input() showInlineErrors: boolean = false;
  @Input() showTitle: boolean = false;
  @Input() showLabels: boolean = false;
}

@Component({
  selector: 'm-registerForm',
  template: '',
})
class MindsFormRegisterMock {
  @Input() referrer: string;
  @Output() done: EventEmitter<any> = new EventEmitter<any>();
}

describe('LoginComponent', () => {
  let comp: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MaterialMock,
          MindsFormLoginMock,
          MindsFormRegisterMock,
          LoginComponent,
          MockComponent({ selector: 'm-marketing__footer' }),
          MockComponent({ selector: 'm-tooltip', inputs: ['icon', 'i18n'] }),
          MockComponent({ selector: 'm-language__bar' }),
        ],
        imports: [
          RouterTestingModule,
          ReactiveFormsModule,
          CommonModule,
          FormsModule,
          CookieModule,
        ],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: Client, useValue: clientMock },
          { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
          { provide: SignupModalService, useValue: signupModalServiceMock },
          Storage,
          CookieService,
          { provide: COOKIE_OPTIONS, useValue: CookieOptionsProvider },
          { provide: TopbarService, useValue: MockService(TopbarService) },
          {
            provide: SidebarNavigationService,
            useValue: MockService(SidebarNavigationService),
          },
          {
            provide: 'QUERY_STRING',
            useValue: null,
          },
          RedirectService,
          { provide: ModalService, useValue: modalServiceMock },
          PageLayoutService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(LoginComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => done());
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a login form', () => {
    const h3: DebugElement = fixture.debugElement.query(
      By.css('.m-login__title h3')
    );
    // expect(h3).not.toBeNull();
    //expect(h3.nativeElement.textContent).toContain('Login to Minds');

    expect(fixture.debugElement.query(By.css('m-loginForm'))).not.toBeNull();
  });

  it('should redirect after logging in', () => {
    expect(loginReferrerServiceMock.navigate).toHaveBeenCalled();
  });

  it('should redirect after registering', () => {
    comp.registered();
    // expect(signupModalServiceMock.setDisplay).toHaveBeenCalled();
    // expect(signupModalServiceMock.setDisplay.calls.mostRecent().args[0]).toBe(
    //   'categories'
    // );
    // expect(signupModalServiceMock.open).toHaveBeenCalled();
    expect(loginReferrerServiceMock.navigate).toHaveBeenCalled();
    expect(
      loginReferrerServiceMock.navigate.calls.mostRecent().args[0]
    ).toEqual({ defaultUrl: '/test' });
  });
});
