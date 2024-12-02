import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ComposerComponent } from './composer.component';
import { ComposerService } from './services/composer.service';
import { MockComponent, MockService } from '../../utils/mock';
import { ComposerModalService } from './components/modal/modal.service';
import { By } from '@angular/platform-browser';
import { ToasterService } from '../../common/services/toaster.service';
import { composerMockService } from '../../mocks/modules/composer/services/composer.service.mock';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from '../../common/services/cookie.service';
import {
  CookieOptionsProvider,
  COOKIE_OPTIONS,
  CookieModule,
} from '@gorniv/ngx-universal';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LivestreamService } from '../../modules/composer/services/livestream.service';
import { ComposerBoostService } from './services/boost.service';
import { PermissionIntentsService } from '../../common/services/permission-intents.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('Composer', () => {
  let comp: ComposerComponent;
  let fixture: ComponentFixture<ComposerComponent>;
  let cookieService: CookieService;
  let service: LivestreamService;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(ComposerService, {
      useValue: composerMockService,
    });

    TestBed.configureTestingModule({
      declarations: [
        ComposerComponent,
        MockComponent({
          selector: 'm-composer__base',
          outputs: ['onPost'],
        }),
      ],
      imports: [CookieModule],
      providers: [
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: ComposerBoostService,
          useValue: MockService(ComposerBoostService, {
            has: ['isBoostMode$'],
            props: {
              isBoostMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: new BehaviorSubject(convertToParamMap({})),
            snapshot: { queryParamMap: convertToParamMap({}) },
          },
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        CookieService,
        {
          provide: COOKIE_OPTIONS,
          useValue: CookieOptionsProvider,
        },
        {
          provide: LivestreamService,
          useValue: MockService(LivestreamService),
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    service = TestBed.inject(LivestreamService);
  }));

  beforeEach((done) => {
    cookieService = TestBed.inject(CookieService);
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ComposerComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should render an embedded base composer', () => {
    comp.embedded = true;
    comp.detectChanges();
    fixture.detectChanges();

    const baseComposer = fixture.debugElement.query(
      By.css('m-composer__base:not(.m-composer__triggerPreview)')
    );
    expect(baseComposer).not.toBeNull();
  });

  it('should render a clickable base composer', () => {
    comp.embedded = false;
    comp.detectChanges();
    fixture.detectChanges();

    const baseComposer = fixture.debugElement.query(
      By.css('m-composer__base.m-composer__triggerPreview')
    );
    expect(baseComposer).not.toBeNull();
  });

  it('should handle createBoost query parameter', fakeAsync(() => {
    (comp as any).composerModalService.setInjector.and.returnValue(
      (comp as any).composerModalService
    );
    (comp as any).composerModalService.present.and.returnValue(
      Promise.resolve({})
    );
    (comp as any).service.setContainer = jasmine.createSpy();
    (comp as any).composerBoostService.isBoostMode$.next(false);
    (comp as any).route.queryParamMap.next(
      convertToParamMap({ createBoost: '1' })
    );
    (comp as any).route.snapshot.queryParamMap = convertToParamMap({
      createBoost: '1',
    });

    tick();

    expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
      true
    );
    expect((comp as any).service.setContainer).toHaveBeenCalled();
    expect((comp as any).composerModalService.present).toHaveBeenCalled();
    expect((comp as any).router.navigate).toHaveBeenCalledOnceWith(['.'], {
      queryParams: {},
      relativeTo: (comp as any).route,
    });
  }));

  it('should handle no createBoost query parameter', fakeAsync(() => {
    (comp as any).composerModalService.setInjector.and.returnValue(
      (comp as any).composerModalService
    );
    (comp as any).service.setContainer = jasmine.createSpy();
    (comp as any).composerBoostService.isBoostMode$.next(false);
    (comp as any).route.queryParamMap.next(convertToParamMap({}));

    tick();

    expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
      false
    );
    expect((comp as any).service.setContainer).not.toHaveBeenCalled();
    expect((comp as any).composerModalService.present).not.toHaveBeenCalled();
    expect((comp as any).router.navigate).not.toHaveBeenCalled();
  }));
});
