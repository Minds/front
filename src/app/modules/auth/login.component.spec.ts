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
} from '@gorniv/ngx-universal';
import { FeaturesService } from '../../services/features.service';
import { featuresServiceMock } from '../../../tests/features-service-mock.spec';
import { IfFeatureDirective } from '../../common/directives/if-feature.directive';
import { TopbarService } from '../../common/layout/topbar.service';
import { MockService, MockComponent } from '../../utils/mock';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { MarketingFooterComponent } from '../../modules/marketing/footer.component';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { LanguageBarComponent } from '../language/language-bar.component';
import { LanguageModalComponent } from '../language/language-modal/language-modal.component';
import { RedirectService } from '../../common/services/redirect.service';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../tests/overlay-modal-service-mock.spec';

@Component({
  selector: 'minds-form-login',
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
  selector: 'minds-form-register',
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
          IfFeatureDirective,
          MarketingFooterComponent,
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
          { provide: FeaturesService, useValue: featuresServiceMock },
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
          { provide: OverlayModalService, useValue: overlayModalServiceMock },
          PageLayoutService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    featuresServiceMock.mock('ux-2020', false);
    featuresServiceMock.mock('navigation', false);
    featuresServiceMock.mock('localization-2020', true);
    featuresServiceMock.mock('helpdesk-2021', false);

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

    expect(
      fixture.debugElement.query(By.css('minds-form-login'))
    ).not.toBeNull();
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
