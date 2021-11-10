import { TestBed } from '@angular/core/testing';

import { CompassHookService } from './compass-hook.service';

describe('CompassHookService', () => {
  let service: CompassHookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompassHookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
