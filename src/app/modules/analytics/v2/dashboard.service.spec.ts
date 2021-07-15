import { TestBed } from '@angular/core/testing';

import { AnalyticsDashboardService } from './dashboard.service';

describe('AnalyticsDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: AnalyticsDashboardService = TestBed.inject(
      AnalyticsDashboardService
    );
    expect(service).toBeTruthy();
  });
});
