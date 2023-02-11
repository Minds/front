import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostService } from '../../../boost.service';
import { BoostConsoleAdminStatsService } from '../../services/admin-stats.service';
import { BoostConsoleService } from '../../services/console.service';
import { BoostConsoleFilterBarComponent } from './filter-bar.component';

describe('BoostConsoleFilterBarComponent', () => {
  let comp: BoostConsoleFilterBarComponent;
  let fixture: ComponentFixture<BoostConsoleFilterBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BoostConsoleFilterBarComponent,
          MockComponent({
            selector: 'm-dropdownMenu',
            inputs: ['menu'],
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
            provide: BoostService,
            useValue: MockService(BoostService),
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
          { provide: Router, useValue: MockService(Router) },
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
});
