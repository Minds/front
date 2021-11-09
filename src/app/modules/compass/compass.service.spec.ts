import { TestBed } from '@angular/core/testing';

import { CompassService } from './compass.service';

describe('CompassServiceService', () => {
  let service: CompassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
