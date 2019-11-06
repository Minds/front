import { TestBed } from '@angular/core/testing';

import {
  AnalyticsDashboardService,
  Category,
  Response,
  Dashboard,
  Filter,
  Option,
  Metric,
  Summary,
  Visualisation,
  Bucket,
  Timespan,
  UserState,
} from './dashboard.service';

describe('AnalyticsDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: AnalyticsDashboardService = TestBed.get(
      AnalyticsDashboardService
    );
    expect(service).toBeTruthy();
  });
});
