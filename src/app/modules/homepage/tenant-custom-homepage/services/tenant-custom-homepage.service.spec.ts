import { TestBed } from '@angular/core/testing';
import { TenantCustomHomepageService } from './tenant-custom-homepage.service';

describe('TenantCustomHomepageService', () => {
  let service: TenantCustomHomepageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenantCustomHomepageService],
    });

    service = TestBed.inject(TenantCustomHomepageService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should identify state as being loaded when all sections are loaded', (done: DoneFn) => {
    service.isMembersSectionLoaded$.next(true);
    service.isGroupsSectionLoaded$.next(true);

    service.isLoaded$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBeTrue();
      done();
    });
  });

  it('should identify state as not being loaded when only members section is loaded', (done: DoneFn) => {
    service.isMembersSectionLoaded$.next(true);
    service.isGroupsSectionLoaded$.next(false);

    service.isLoaded$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBeFalse();
      done();
    });
  });

  it('should identify state as not being loaded when only groups section is loaded', (done: DoneFn) => {
    service.isMembersSectionLoaded$.next(false);
    service.isGroupsSectionLoaded$.next(true);

    service.isLoaded$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBeFalse();
      done();
    });
  });

  it('should identify state as not being loaded when no sections are loaded', (done: DoneFn) => {
    service.isMembersSectionLoaded$.next(false);
    service.isGroupsSectionLoaded$.next(false);

    service.isLoaded$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBeFalse();
      done();
    });
  });
});
