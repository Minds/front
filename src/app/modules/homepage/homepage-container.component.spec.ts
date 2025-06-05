import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { HomepageContainerComponent } from './homepage-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouterEvent,
  convertToParamMap,
} from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { ResetPasswordModalService } from '../auth/reset-password-modal/reset-password-modal.service';
import { SiteService } from '../../common/services/site.service';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { Session } from '../../services/session';
import { MockComponent, MockService } from '../../utils/mock';
import { MetaService } from '../../common/services/meta.service';
import { IfTenantDirective } from '../../common/directives/if-tenant.directive';
import { ConfigsService } from '../../common/services/configs.service';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';

describe('HomepageContainerComponent', () => {
  let component: HomepageContainerComponent;
  let fixture: ComponentFixture<HomepageContainerComponent>;
  let mockRouter: Router;
  let mockSession: any;
  let mockResetPasswordModalService: any;
  let mockSiteService: any;
  let mockIsTenantService: any;
  let routerEvents: BehaviorSubject<RouterEvent>;
  let mockMetaService = {
    setTitle: jasmine.createSpy('setTitle').and.returnValue({
      setDescription: jasmine.createSpy('setDescription').and.returnValue({
        setCanonicalUrl: jasmine.createSpy('setCanonicalUrl').and.returnValue({
          setOgUrl: jasmine.createSpy('setOgUrl'),
        }),
      }),
    }),
  };

  let queryParamsSubject = new BehaviorSubject({});

  let mockActivatedRoute = {
    snapshot: {
      queryParamMap: convertToParamMap(queryParamsSubject.value),
      fragment: '',
    },
    queryParams: queryParamsSubject.asObservable(),
  };

  beforeEach(async () => {
    mockSession = jasmine.createSpyObj('Session', ['isLoggedIn']);
    mockResetPasswordModalService = jasmine.createSpyObj(
      'ResetPasswordModalService',
      ['open']
    );
    mockSiteService = jasmine.createSpyObj('SiteService', [], {
      title: 'Site Title',
    });
    mockIsTenantService = jasmine.createSpyObj('IsTenantService', ['is']);

    routerEvents = new BehaviorSubject<RouterEvent>(
      new NavigationEnd(1, '', '')
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        HomepageContainerComponent,
        IfTenantDirective,
        MockComponent({ selector: 'm-productPage__base' }),
        MockComponent({ selector: 'm-defaultFeed__container' }),
        MockComponent({ selector: 'm-homepage--customTenant' }),
      ],
      providers: [
        {
          provide: Session,
          useValue: mockSession,
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: IsTenantService,
          useValue: mockIsTenantService,
        },
        {
          provide: SiteService,
          useValue: MockService(SiteService),
        },
        {
          provide: MetaService,
          useValue: mockMetaService,
        },
        {
          provide: ResetPasswordModalService,
          useValue: MockService(ResetPasswordModalService),
        },
        {
          provide: AuthRedirectService,
          useValue: MockService(AuthRedirectService),
        },
        {
          provide: AuthModalService,
          useValue: MockService(AuthModalService, {
            open: () => new Promise(null),
          }),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
      ],
    }).compileComponents();

    mockRouter = TestBed.inject(Router);
    spyOnProperty(mockRouter, 'events').and.returnValue(
      routerEvents.asObservable()
    );
    mockIsTenantService.is.and.returnValue(false);
    fixture = TestBed.createComponent(HomepageContainerComponent);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'isTenantNetwork', {
      writable: true,
      value: false,
    });

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should redirect if logged in to a non-tenant', fakeAsync(() => {
      Object.defineProperty(component, 'isTenantNetwork', {
        writable: true,
        value: false,
      });
      mockActivatedRoute.snapshot.fragment = '';
      mockSession.isLoggedIn.and.returnValue(true);
      spyOn(mockRouter, 'navigate');

      component.ngOnInit();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/newsfeed']);
    }));

    it('should redirect if logged in to a tenant', fakeAsync(() => {
      Object.defineProperty(component, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (component as any).config.get
        .withArgs('tenant')
        .and.returnValue({ 'custom_home_page_enabled': false });
      mockActivatedRoute.snapshot.fragment = '';
      mockSession.isLoggedIn.and.returnValue(true);

      component.ngOnInit();
      tick();

      expect(
        (component as any).authRedirectService.redirect
      ).toHaveBeenCalled();
    }));

    it('should redirect if logged in, with createBoost parameter when boost fragment is present', fakeAsync(() => {
      (
        component as any
      ).authRedirectService.getDefaultRedirectUrl.and.returnValue('/newsfeed');
      mockActivatedRoute.snapshot.fragment = 'boost';
      mockSession.isLoggedIn.and.returnValue(true);
      spyOn(mockRouter, 'navigate');

      component.ngOnInit();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/newsfeed'], {
        queryParams: { createBoost: 1 },
      });
    }));
  });
  it('should display default feed if tenant', () => {
    mockSession.isLoggedIn.and.returnValue(false);
    mockIsTenantService.is.and.returnValue(true);

    fixture = TestBed.createComponent(HomepageContainerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    const defaultFeedContainer = fixture.nativeElement.querySelector(
      'm-defaultFeed__container'
    );
    expect(defaultFeedContainer).not.toBeNull();
  });

  it('should display product page if not tenant', () => {
    mockSession.isLoggedIn.and.returnValue(false);
    mockIsTenantService.is.and.returnValue(false);
    fixture.detectChanges();
    const productPageBase = fixture.nativeElement.querySelector(
      'm-productPage__base'
    );
    expect(productPageBase).not.toBeNull();
  });
});
