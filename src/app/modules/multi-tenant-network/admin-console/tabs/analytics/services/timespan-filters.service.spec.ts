import { TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsTimespanFiltersService } from './timespan-filters.service';
import * as moment from 'moment';

describe('NetworkAdminAnalyticsTimespanFiltersService', () => {
  let service: NetworkAdminAnalyticsTimespanFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkAdminAnalyticsTimespanFiltersService],
    });

    service = TestBed.inject(NetworkAdminAnalyticsTimespanFiltersService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should get filters', () => {
    const filters = service.filters;
    expect(filters).toBe({
      id: 'timespan',
      label: 'Timespan',
      options: [
        {
          id: '7d',
          label: 'Last 7 days',
          selected: false,
          from_ts_ms: service.instantiationTimestamp
            .clone()
            .subtract(7, 'days')
            .startOf('day')
            .unix(),
        },
        {
          id: '30d',
          label: 'Last 30 days',
          selected: true,
          from_ts_ms: service.instantiationTimestamp
            .clone()
            .subtract(30, 'days')
            .startOf('day')
            .unix(),
        },
        {
          id: '1y',
          label: 'Last 12 months',
          selected: false,
          from_ts_ms: service.instantiationTimestamp
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
    });
  });
});
