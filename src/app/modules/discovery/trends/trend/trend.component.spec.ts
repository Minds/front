import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { EntitiesService } from '../../../../common/services/entities.service';
import { MetaService } from '../../../../common/services/meta.service';
import { RouterHistoryService } from '../../../../common/services/router-history.service';
import { composerMockService } from '../../../../mocks/modules/composer/services/composer.service.mock';
import { Session } from '../../../../services/session';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ComposerService } from '../../../composer/services/composer.service';
import { GuestModeExperimentService } from '../../../experiments/sub-services/guest-mode-experiment.service';
import { PaywallService } from '../../../wire/v2/paywall.service';
import { DiscoveryService } from '../../discovery.service';
import { DiscoveryTrendComponent } from './trend.component';

describe('DiscoveryTrendComponent', () => {
  let comp: DiscoveryTrendComponent;
  let fixture: ComponentFixture<DiscoveryTrendComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        declarations: [
          DiscoveryTrendComponent,
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
        ],
        providers: [
          {
            provide: EntitiesService,
            useValue: MockService(EntitiesService),
          },
          {
            provide: ActivatedRoute,
            useValue: MockService(ActivatedRoute, {
              has: ['paramMap', 'snapshot'],
              props: {
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
            provide: DiscoveryService,
            useValue: MockService(DiscoveryService, {
              has: ['isPlusPage$'],
              props: {
                isPlusPage$: { get: () => new BehaviorSubject<boolean>(false) },
              },
            }),
          },
          {
            provide: MetaService,
            useValue: MockService(MetaService),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: RouterHistoryService,
            useValue: MockService(RouterHistoryService),
          },
          {
            provide: GuestModeExperimentService,
            useValue: MockService(GuestModeExperimentService),
          },
        ],
      })
        .overrideProvider(ComposerService, {
          useValue: composerMockService,
        })
        .overrideProvider(PaywallService, {
          useValue: MockService(PaywallService),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DiscoveryTrendComponent);
    comp = fixture.componentInstance;
    (comp as any).entitiesService.single.and.returnValue(of(null));

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

  it('should get back navigation path when discovery homepage should be shown', () => {
    (comp as any).guestModeExperiment.isActive.and.returnValue(true);
    expect(comp.getBackNavigationPath()).toBe('/');
  });

  it('should get back navigation path when no discovery homepage experiment and previous url exists, stripping querystring', () => {
    (comp as any).guestModeExperiment.isActive.and.returnValue(false);
    (comp as any).session.getLoggedInUser.and.returnValue({});

    (comp as any).routerHistory.getPreviousUrl.and.returnValue(
      '/previousUrl?test=1'
    );
    expect(comp.getBackNavigationPath()).toBe('/previousUrl');
  });

  it('should get default back navigation path when no discovery homepage experiment and no previous url exists', () => {
    (comp as any).guestModeExperiment.isActive.and.returnValue(false);
    (comp as any).session.getLoggedInUser.and.returnValue({});

    (comp as any).routerHistory.getPreviousUrl.and.returnValue(null);
    expect(comp.getBackNavigationPath()).toBe('../..');
  });
});
