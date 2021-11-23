import { TestBed } from '@angular/core/testing';

import { TagSettingsService } from './tag-settings.service';

describe('TagSettingsService', () => {
  let service: TagSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
