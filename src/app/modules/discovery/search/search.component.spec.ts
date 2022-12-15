import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { MetaService } from '../../../common/services/meta.service';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { Session } from '../../../services/session';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { CardCarouselService } from '../card-carousel/card-carousel.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { DiscoverySearchComponent } from './search.component';

describe('DiscoverySearchComponent', () => {
  let comp: DiscoverySearchComponent;
  let fixture: ComponentFixture<DiscoverySearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        declarations: [
          DiscoverySearchComponent,
          MockComponent({
            selector: 'm-discovery__settingsButton',
          }),
          MockComponent({
            selector: 'm-discovery__tagWidget',
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
          }),
          MockDirective({
            selector: 'm-clientMeta',
          }),
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: MockService(ActivatedRoute, {
              has: ['queryParamMap', 'snapshot'],
              props: {
                queryParamMap: {
                  get: () =>
                    new BehaviorSubject<ParamMap>({
                      get: (key: string) => '1',
                      has: () => void 0,
                      getAll: () => void 0,
                      keys: [''],
                    }),
                },
                paramMap: {
                  get: () =>
                    new BehaviorSubject<ParamMap>({
                      get: (key: string) => '1',
                      has: () => void 0,
                      getAll: () => void 0,
                      keys: [''],
                    }),
                },
                snapshot: { get: () => new ActivatedRouteSnapshot() },
              },
            }),
          },
          {
            provider: Router,
            useValue: MockService(Router),
          },
          {
            provider: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provider: RouterHistoryService,
            useValue: MockService(RouterHistoryService),
          },
        ],
      })
        .overrideProvider(CardCarouselService, {
          useValue: MockService(CardCarouselService, {
            has: ['inProgress$'],
            props: {
              inProgress$: { get: () => new BehaviorSubject<any>(false) },
            },
          }),
        })
        .overrideProvider(DiscoveryFeedsService, {
          useValue: MockService(DiscoveryFeedsService, {
            has: [
              'entities$',
              'type$',
              'inProgress$',
              'hasMoreData$',
              'nsfw$',
              'filter$',
              'period$',
            ],
            props: {
              entities$: { get: () => new BehaviorSubject<any[]>([]) },
              type$: { get: () => new BehaviorSubject<any>('type') },
              inProgress$: { get: () => new BehaviorSubject<any>(false) },
              hasMoreData$: { get: () => new BehaviorSubject<any>(false) },
              nsfw$: { get: () => new BehaviorSubject<any>(false) },
              filter$: { get: () => new BehaviorSubject<any>(null) },
              period$: { get: () => new BehaviorSubject<any>(null) },
            },
          }),
        })
        .overrideProvider(MetaService, {
          useValue: MockService(MetaService),
        })
        .overrideProvider(ConfigsService, {
          useValue: MockService(ConfigsService),
        })
        .overrideProvider(Session, {
          useValue: MockService(Session),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DiscoverySearchComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should get back navigation path when there is previous history starting with /discovery', () => {
    spyOn((comp as any).routerHistory, 'getPreviousUrl').and.returnValue(
      '/discovery/tags?213'
    );
    expect(comp.getBackNavigationPath()).toBe('/discovery/tags');
  });

  it('should should DISREGARD back navigation path when there is previous history NOT starting with /discovery', () => {
    spyOn((comp as any).routerHistory, 'getPreviousUrl').and.returnValue(
      '/newsfeed/tags?213'
    );
    expect(comp.getBackNavigationPath()).toBe('../');
  });

  it('should default back navigation path to ../ when there is NO previous history', () => {
    spyOn((comp as any).routerHistory, 'getPreviousUrl').and.returnValue('');
    expect(comp.getBackNavigationPath()).toBe('../');
    (comp as any).routerHistory.getPreviousUrl.and.returnValue(null);
    expect(comp.getBackNavigationPath()).toBe('../');
  });
});
