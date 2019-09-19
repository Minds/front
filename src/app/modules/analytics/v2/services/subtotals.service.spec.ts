import { TestBed } from '@angular/core/testing';

import { SubtotalsService } from './subtotals.service';

describe('SubtotalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubtotalsService = TestBed.get(SubtotalsService);
    expect(service).toBeTruthy();
  });
});
