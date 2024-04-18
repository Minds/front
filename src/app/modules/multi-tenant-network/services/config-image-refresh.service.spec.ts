import { TestBed } from '@angular/core/testing';
import { MultiTenantConfigImageRefreshService } from './config-image-refresh.service';
import { MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';

describe('MultiTenantConfigImageRefreshService', () => {
  let service: MultiTenantConfigImageRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultiTenantConfigImageRefreshService,
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    });

    service = TestBed.inject(MultiTenantConfigImageRefreshService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should increment square logo count', () => {
    service.squareLogoLastCacheTimestamp$.next(0);
    let timestampValue: number =
      service.squareLogoLastCacheTimestamp$.getValue();

    service.updateSquareLogoLastCacheTimestamp();
    expect(service.squareLogoLastCacheTimestamp$.getValue()).toBeGreaterThan(
      timestampValue
    );
  });

  it('should increment favicon logo count', () => {
    service.faviconLastCacheTimestamp$.next(0);
    let timestampValue: number = service.faviconLastCacheTimestamp$.getValue();

    service.updateFaviconLastCacheTimestamp();
    expect(service.faviconLastCacheTimestamp$.getValue()).toBeGreaterThan(
      timestampValue
    );
  });

  it('should increment horizontal logo count', () => {
    service.horizontalLogoLastCacheTimestamp$.next(0);
    let timestampValue: number =
      service.horizontalLogoLastCacheTimestamp$.getValue();

    service.updateHorizontalLogoLastCacheTimestamp();
    expect(
      service.horizontalLogoLastCacheTimestamp$.getValue()
    ).toBeGreaterThan(timestampValue);
  });
});
