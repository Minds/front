import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { ConfigsService } from '../../common/services/configs.service';
import { AuthModalService } from './modal/auth-modal.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { OnboardingV5Service } from '../onboarding-v5/services/onboarding-v5.service';
import { MockService } from '../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { RegisterComponent } from './register.component';
import { Navigation as NavigationService } from '../../services/navigation';
import { MetaService } from '../../common/services/meta.service';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { SiteService } from '../../common/services/site.service';
import { PagesService } from '../../common/services/pages.service';
import { WINDOW } from '../../common/injection-tokens/common-injection-tokens';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';

describe('RegisterComponent', () => {
  let comp: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: Client, useValue: MockService(Client) },
        { provide: Router, useValue: MockService(Router) },
        { provide: PagesService, useValue: MockService(PagesService) },
        {
          provide: LoginReferrerService,
          useValue: MockService(LoginReferrerService),
        },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: NavigationService,
          useValue: MockService(NavigationService),
        },
        {
          provide: SidebarNavigationService,
          useValue: MockService(SidebarNavigationService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: TopbarService, useValue: MockService(TopbarService) },
        { provide: MetaService, useValue: MockService(MetaService) },
        {
          provide: PageLayoutService,
          useValue: MockService(PageLayoutService),
        },
        {
          provide: AuthRedirectService,
          useValue: MockService(AuthRedirectService),
        },
        { provide: IsTenantService, useValue: MockService(IsTenantService) },
        { provide: SiteService, useValue: MockService(SiteService) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['queryParams', 'snapshot'],
            props: {
              queryParams: {
                get: () => new BehaviorSubject<Params>({}),
              },
              snapshot: {
                get: () => {
                  return {
                    queryParams: new BehaviorSubject<Params>({}),
                  };
                },
              },
            },
          }),
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

    fixture = TestBed.createComponent(RegisterComponent);
    comp = fixture.componentInstance;

    (comp as any).metaService.setTitle.and.returnValue(
      (comp as any).metaService
    );

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

      (comp as any).configs.get.withArgs('site_url').and.returnValue(siteUrl);
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
