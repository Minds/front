import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsBaseComponent } from './base.component';
import { NetworkAdminAnalyticsKpisService } from '../../services/kpis.service';
import { NetworkAdminAnalyticsTimespanFiltersService } from '../../services/timespan-filters.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { Filter, Option } from '../../../../../../../interfaces/dashboard';
import {
  AnalyticsMetricEnum,
  GetAdminAnalyticsChartAndKpisQuery,
} from '../../../../../../../../graphql/generated.engine';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';

const mockInstantiationTimestamp: moment.Moment = moment();

export const mockGetAdminAnalyticsChartAndKpisQuery: GetAdminAnalyticsChartAndKpisQuery = {
  __typename: 'Query',
  tenantAdminAnalyticsChart: {
    __typename: 'AnalyticsChartType',
    metric: AnalyticsMetricEnum.DailyActiveUsers,
    segments: [
      {
        buckets: [
          {
            date: moment().toString(),
            key: 'users',
            value: 100,
          },
          {
            date: moment().toString(),
            key: 'users',
            value: 200,
          },
        ],
      },
    ],
  },
  tenantAdminAnalyticsKpis: [
    {
      __typename: 'AnalyticsKpiType',
      metric: AnalyticsMetricEnum.DailyActiveUsers,
      value: 1000,
      previousPeriodValue: 500,
    },
    {
      __typename: 'AnalyticsKpiType',
      metric: AnalyticsMetricEnum.MeanSessionSecs,
      value: 30,
      previousPeriodValue: 25,
    },
  ],
};

const mockFilters: Filter = {
  id: 'timespan',
  label: 'Timespan',
  options: [
    {
      id: '7d',
      label: 'Last 7 days',
      selected: false,
      from_ts_ms: mockInstantiationTimestamp
        .clone()
        .subtract(7, 'days')
        .startOf('day')
        .unix(),
    },
    {
      id: '30d',
      label: 'Last 30 days',
      selected: true,
      from_ts_ms: mockInstantiationTimestamp
        .clone()
        .subtract(30, 'days')
        .startOf('day')
        .unix(),
    },
    {
      id: '1y',
      label: 'Last 12 months',
      selected: false,
      from_ts_ms: mockInstantiationTimestamp
        .clone()
        .subtract(1, 'year')
        .startOf('day')
        .unix(),
    },
    {
      id: 'ytd',
      label: 'Year to date',
      selected: false,
      from_ts_ms: moment()
        .startOf('year')
        .startOf('day')
        .unix(),
    },
  ],
};

describe('NetworkAdminAnalyticsBaseComponent', () => {
  let comp: NetworkAdminAnalyticsBaseComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsBaseComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        NetworkAdminAnalyticsBaseComponent,
        MockComponent({
          selector: 'm-networkAdminAnalytics__updateTimestamp',
        }),
        MockComponent({
          selector: 'm-dropdownSelector',
        }),
        MockComponent({
          selector: 'm-chartV2',
        }),
        MockComponent({
          selector: 'm-networkAdminAnalytics__kpis',
        }),
        MockComponent({
          selector: 'm-networkAdminAnalytics__tabs',
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
        }),
      ],
      providers: [
        {
          provide: NetworkAdminAnalyticsKpisService,
          useValue: MockService(NetworkAdminAnalyticsKpisService, {
            has: ['data$', 'inProgress$'],
            props: {
              data$: mockGetAdminAnalyticsChartAndKpisQuery,
              inProgress$: new BehaviorSubject<boolean>(false),
            },
          }),
        },
        {
          provide: NetworkAdminAnalyticsTimespanFiltersService,
          useValue: MockService(NetworkAdminAnalyticsTimespanFiltersService, {
            has: ['filters', 'instantiationTimestamp'],
            props: {
              filters: mockFilters,
              instantiationTimestamp: {
                get: () => {
                  return mockInstantiationTimestamp;
                },
              },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => {
                  return {
                    queryParams: new BehaviorSubject<Params>({
                      timespan: '30d',
                    }),
                  };
                },
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminAnalyticsBaseComponent);
    comp = fixture.componentInstance;

    (comp as any).timespanFiltersService.getOptionById.and.returnValue(
      mockFilters.options[1]
    );

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

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).kpisService.patchParams).toHaveBeenCalledWith({
      fromUnixTs: mockFilters.options[1].from_ts_ms,
      toUnixTs: mockInstantiationTimestamp.unix(),
    });
    expect((comp as any).router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { timespan: '30d' },
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should handle timespan selection', () => {
    (comp as any).router.navigate.calls.reset();
    (comp as any).kpisService.patchParams.calls.reset();

    comp.selectionMade({
      option: {
        id: '7d',
      } as Option,
      filterId: 'id',
    });
    expect((comp as any).kpisService.patchParams).toHaveBeenCalledWith({
      fromUnixTs: mockFilters.options[1].from_ts_ms,
      toUnixTs: mockInstantiationTimestamp.unix(),
    });
    expect((comp as any).router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { timespan: '7d' },
        queryParamsHandling: 'merge',
      })
    );
  });
});
