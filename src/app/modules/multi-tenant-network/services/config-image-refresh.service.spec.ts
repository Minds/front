import { TestBed } from '@angular/core/testing';
import { MultiTenantConfigImageRefreshService } from './config-image-refresh.service';

describe('MultiTenantConfigImageRefreshService', () => {
  let service: MultiTenantConfigImageRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiTenantConfigImageRefreshService],
    });

    service = TestBed.inject(MultiTenantConfigImageRefreshService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should increment square logo count', () => {
    expect(service.squareLogoCount$.getValue()).toBe(0);
    service.incremenetSquareLogoCount();
    expect(service.squareLogoCount$.getValue()).toBe(1);
    service.incremenetSquareLogoCount();
    expect(service.squareLogoCount$.getValue()).toBe(2);
  });

  it('should increment favicon logo count', () => {
    expect(service.faviconCount$.getValue()).toBe(0);
    service.incremenetFaviconCount();
    expect(service.faviconCount$.getValue()).toBe(1);
    service.incremenetFaviconCount();
    expect(service.faviconCount$.getValue()).toBe(2);
  });

  it('should increment horizontal logo count', () => {
    expect(service.horizontalLogoCount$.getValue()).toBe(0);
    service.incremenetHorizontalLogoCount();
    expect(service.horizontalLogoCount$.getValue()).toBe(1);
    service.incremenetHorizontalLogoCount();
    expect(service.horizontalLogoCount$.getValue()).toBe(2);
  });
});
