import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostConsoleAdminStatsService } from '../../services/admin-stats.service';
import { BoostConsoleService } from '../../services/console.service';
import { BoostConsoleFilterBarComponent } from './filter-bar.component';
import { BoostGroupExperimentService } from '../../../../experiments/sub-services/boost-groups-experiment.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('BoostConsoleFilterBarComponent', () => {
  let comp: BoostConsoleFilterBarComponent;
  let fixture: ComponentFixture<BoostConsoleFilterBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          BoostConsoleFilterBarComponent,
          MockComponent({
            selector: 'm-dropdownMenu',
            inputs: ['menu'],
          }),
          MockComponent({
            selector: 'm-tooltip',
          }),
          MockComponent({
            selector: 'm-feedNotice--boostLatestPost',
            inputs: ['isInFeed', 'targetBoostLocation', 'dismissible'],
          }),
        ],
        providers: [
          {
            provide: BoostConsoleService,
            useValue: MockService(BoostConsoleService, {
              has: ['adminContext$'],
              props: {
                adminContext$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
              },
            }),
          },
          {
            provide: BoostConsoleAdminStatsService,
            useValue: MockService(BoostConsoleAdminStatsService, {
              has: ['pendingSafeCount$', 'pendingControversialCount$'],
              props: {
                pendingSafeCount$: {
                  get: () => new BehaviorSubject<number>(0),
                },
                pendingControversialCount$: {
                  get: () => new BehaviorSubject<number>(0),
                },
              },
            }),
          },
          {
            provide: BoostGroupExperimentService,
            useValue: MockService(BoostGroupExperimentService),
          },
          { provide: Router, useValue: MockService(Router) },
          { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostConsoleFilterBarComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).adminStats.pendingSafeCount$.next(0);
    (comp as any).adminStats.pendingControversialCount$.next(0);

    (comp as any).service.adminContext$.next(false);

    (comp as any).boostGroupExperiment.isActive.and.returnValue(true);

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
    expect((comp as any).adminStats.fetch).not.toHaveBeenCalled();
  });

  it('should load admin stats when in admin context on init', () => {
    (comp as any).service.adminContext$.next(true);
    comp.ngOnInit();
    expect((comp as any).adminStats.fetch).toHaveBeenCalled();
  });

  it('should reload admin stats on suitability filter change', () => {
    (comp as any).service.adminContext$.next(true);
    comp.onSuitabilityFilterChange('safe');
    expect((comp as any).service.updateQueryParams).toHaveBeenCalledWith({
      suitability: 'safe',
    });
    expect((comp as any).adminStats.fetch).toHaveBeenCalled();
  });

  describe('boostGroupExperimentIsActive', () => {
    it('should return false when experiment is not active', () => {
      (comp as any).boostGroupExperiment.isActive.and.returnValue(false);
      comp.ngOnInit();
      expect(comp.boostGroupExperimentIsActive).toBe(false);
    });

    it('should return true when experiment is active', () => {
      (comp as any).boostGroupExperiment.isActive.and.returnValue(true);
      comp.ngOnInit();
      expect(comp.boostGroupExperimentIsActive).toBe(true);
    });
  });
});
