import { TestBed } from '@angular/core/testing';

import { DismissalService } from './dismissal.service';

describe('DismissalService', () => {
  let service: DismissalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DismissalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
