import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { CookieService } from '../../common/services/cookie.service';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { ConfigsService } from '../../common/services/configs.service';
import { AuthModalService } from './modal/auth-modal.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { OnboardingV5Service } from '../onboarding-v5/services/onboarding-v5.service';
import { MockService } from '../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { WINDOW } from '../../common/injection-tokens/common-injection-tokens';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';

describe('LoginComponent', () => {
  let comp: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['queryParams'],
            props: {
              queryParams: {
                get: () => new BehaviorSubject<Params>({}),
              },
            },
          }),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: LoginReferrerService,
          useValue: MockService(LoginReferrerService),
        },
        { provide: CookieService, useValue: MockService(CookieService) },
        { provide: TopbarService, useValue: MockService(TopbarService) },
        {
          provide: SidebarNavigationService,
          useValue: MockService(SidebarNavigationService),
        },
        {
          provide: PageLayoutService,
          useValue: MockService(PageLayoutService),
        },
        {
          provide: AuthModalService,
          useValue: MockService(AuthModalService, {
            has: ['onLoggedIn$'],
            props: {
              onLoggedIn$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: AuthRedirectService,
          useValue: MockService(AuthRedirectService),
        },
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['onboardingCompleted$'],
            props: {
              onboardingCompleted$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: WINDOW,
          useValue: {
            location: {
              href: '',
            },
          },
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: true,
        },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('registered', () => {
    it('should navigate to redirectTo on register', fakeAsync(() => {
      const redirectTo: string = '/test';
      (comp as any).redirectTo = redirectTo;

      (comp as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect((comp as any).router.navigate).toHaveBeenCalledWith(
        [redirectTo],
        {}
      );
    }));

    it('should navigate to redirectTo on register with query parameters', fakeAsync(() => {
      const redirectTo: string = '/test?test1=123&test2=456';
      (comp as any).redirectTo = redirectTo;

      (comp as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/test'], {
        queryParams: {
          test1: '123',
          test2: '456',
        },
      });
    }));

    it('should navigate to redirectTo for api redirect on register', fakeAsync(() => {
      const siteUrl: string = 'https://example.minds.com/';
      const redirectTo: string = `${siteUrl}api/v1/test`;

      (comp as any).config.get.withArgs('site_url').and.returnValue(siteUrl);
      (comp as any).redirectTo = redirectTo;

      (comp as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect((comp as any).window.location.href).toEqual(redirectTo);
    }));

    it('should navigate to auth redirect service url on register, when no redirectTo is set', fakeAsync(() => {
      const redirectTo: string = '/test';
      (comp as any).redirectTo = null;

      (comp as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect((comp as any).authRedirectService.redirect).toHaveBeenCalled();
    }));
  });
});
