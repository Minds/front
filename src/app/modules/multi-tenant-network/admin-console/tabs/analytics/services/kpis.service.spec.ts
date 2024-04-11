import { TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsKpisService } from './kpis.service';
import {
  AnalyticsMetricEnum,
  GetAdminAnalyticsChartAndKpisGQL,
  GetAdminAnalyticsChartAndKpisQuery,
} from '../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { MockService } from '../../../../../../utils/mock';
import { of, take } from 'rxjs';
import { mockGetAdminAnalyticsChartAndKpisQuery } from '../components/base/base.component.spec';
import * as moment from 'moment';

describe('NetworkAdminAnalyticsKpisService', () => {
  let service: NetworkAdminAnalyticsKpisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkAdminAnalyticsKpisService,
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).overrideProvider(GetAdminAnalyticsChartAndKpisGQL, {
      useValue: jasmine.createSpyObj<GetAdminAnalyticsChartAndKpisGQL>([
        'fetch',
      ]),
    });

    service = TestBed.inject(NetworkAdminAnalyticsKpisService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should handle data subscription', (done: DoneFn) => {
    (service as any).getTenantAnalyticsChartAndKpisGql.fetch.and.returnValue(
      of({
        data: mockGetAdminAnalyticsChartAndKpisQuery,
      })
    );

    service.data$.pipe(take(1)).subscribe((data) => {
      expect(data).toBe(mockGetAdminAnalyticsChartAndKpisQuery);
      done();
    });
  });

  it('should patch params', () => {
    (service as any).params$.next({
      chartMetric: AnalyticsMetricEnum.DailyActiveUsers,
      kpiMetrics: [
        AnalyticsMetricEnum.TotalUsers,
        AnalyticsMetricEnum.DailyActiveUsers,
        AnalyticsMetricEnum.MeanSessionSecs,
        AnalyticsMetricEnum.Visitors,
        AnalyticsMetricEnum.TotalSiteMembershipSubscriptions,
      ],
      fromUnixTs: moment().subtract(7, 'days').unix(),
      toUnixTs: moment().unix(),
    });

    const newFromTs: number = moment().subtract(14, 'days').unix();

    service.patchParams({
      fromUnixTs: newFromTs,
    });

    expect((service as any).params$.value).toEqual({
      chartMetric: AnalyticsMetricEnum.DailyActiveUsers,
      kpiMetrics: [
        AnalyticsMetricEnum.TotalUsers,
        AnalyticsMetricEnum.DailyActiveUsers,
        AnalyticsMetricEnum.MeanSessionSecs,
        AnalyticsMetricEnum.Visitors,
        AnalyticsMetricEnum.TotalSiteMembershipSubscriptions,
      ],
      fromUnixTs: newFromTs,
      toUnixTs: moment().unix(),
    });
  });
});
