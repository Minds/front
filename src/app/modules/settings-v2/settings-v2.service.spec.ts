import { TestBed } from '@angular/core/testing';

import { SettingsV2Service } from './settings-v2.service';

describe('SettingsV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsV2Service = TestBed.get(SettingsV2Service);
    expect(service).toBeTruthy();
  });
});
