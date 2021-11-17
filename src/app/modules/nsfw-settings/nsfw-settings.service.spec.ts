import { TestBed } from '@angular/core/testing';

import { NsfwSettingsService } from './nsfw-settings.service';

describe('NsfwSettingsService', () => {
  let service: NsfwSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NsfwSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
