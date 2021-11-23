import { TestBed } from '@angular/core/testing';

import { ContentSettingsService } from './content-settings.service';

describe('ContentSettingsService', () => {
  let service: ContentSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
