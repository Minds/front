import { TestBed } from '@angular/core/testing';
import {
  ConfigImageType,
  FAVICON_PATH,
  HORIZONTAL_LOGO_PATH,
  MultiTenantConfigImageService,
  SQUARE_LOGO_PATH,
} from './config-image.service';
import { ApiService } from '../../../common/api/api.service';
import { MultiTenantConfigImageRefreshService } from './config-image-refresh.service';
import { MockService } from '../../../utils/mock';
import { BehaviorSubject, take } from 'rxjs';

describe('MultiTenantConfigImageService', () => {
  let service: MultiTenantConfigImageService;
  let mockTimestamp = Date.now();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultiTenantConfigImageService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj<ApiService>(['upload']),
        },
        {
          provide: MultiTenantConfigImageRefreshService,
          useValue: MockService(MultiTenantConfigImageRefreshService, {
            has: [
              'horizontalLogoLastCacheTimestamp$',
              'squareLogoLastCacheTimestamp$',
              'faviconLastCacheTimestamp$',
            ],
            props: {
              horizontalLogoLastCacheTimestamp$: {
                get: () => new BehaviorSubject<number>(mockTimestamp),
              },
              squareLogoLastCacheTimestamp$: {
                get: () => new BehaviorSubject<number>(mockTimestamp),
              },
              faviconLastCacheTimestamp$: {
                get: () => new BehaviorSubject<number>(mockTimestamp),
              },
            },
          }),
        },
      ],
    });

    service = TestBed.inject(MultiTenantConfigImageService);
    (service as any).configImageRefreshService.horizontalLogoLastCacheTimestamp$.next(
      mockTimestamp
    );
    (service as any).configImageRefreshService.squareLogoLastCacheTimestamp$.next(
      mockTimestamp
    );
    (service as any).configImageRefreshService.faviconLastCacheTimestamp$.next(
      mockTimestamp
    );
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('horizontalLogoPath$', () => {
    it('should get path with no timestamp when no timestamp is set', (done: DoneFn) => {
      (service as any).configImageRefreshService.horizontalLogoLastCacheTimestamp$.next(
        null
      );

      service.horizontalLogoPath$.pipe(take(1)).subscribe((path: string) => {
        expect(path).toBe(HORIZONTAL_LOGO_PATH);
        done();
      });
    });

    it('should get path timestamp when refresh timestamp is set', (done: DoneFn) => {
      (service as any).configImageRefreshService.horizontalLogoLastCacheTimestamp$.next(
        mockTimestamp
      );

      service.horizontalLogoPath$.pipe(take(1)).subscribe((path: string) => {
        expect(path).toBe(`${HORIZONTAL_LOGO_PATH}?lastCache=${mockTimestamp}`);
        done();
      });
    });
  });

  describe('squareLogoPath$', () => {
    it('should get path with no timestamp when no timestamp is set', (done: DoneFn) => {
      (service as any).configImageRefreshService.squareLogoLastCacheTimestamp$.next(
        null
      );

      service.squareLogoPath$.pipe(take(1)).subscribe((path: string) => {
        expect(path).toBe(SQUARE_LOGO_PATH);
        done();
      });
    });

    it('should get path timestamp when refresh timestamp is set', (done: DoneFn) => {
      (service as any).configImageRefreshService.squareLogoLastCacheTimestamp$.next(
        mockTimestamp
      );

      service.squareLogoPath$.pipe(take(1)).subscribe((path: string) => {
        expect(path).toBe(`${SQUARE_LOGO_PATH}?lastCache=${mockTimestamp}`);
        done();
      });
    });
  });

  describe('faviconPath$', () => {
    it('should get path with no timestamp when no timestamp is set', (done: DoneFn) => {
      (service as any).configImageRefreshService.faviconLastCacheTimestamp$.next(
        null
      );

      service.faviconPath$.pipe(take(1)).subscribe((path: string) => {
        expect(path).toBe(FAVICON_PATH);
        done();
      });
    });

    it('should get path timestamp when refresh timestamp is set', (done: DoneFn) => {
      (service as any).configImageRefreshService.faviconLastCacheTimestamp$.next(
        mockTimestamp
      );

      service.faviconPath$.pipe(take(1)).subscribe((path: string) => {
        expect(path).toBe(`${FAVICON_PATH}?lastCache=${mockTimestamp}`);
        done();
      });
    });
  });

  describe('upload', () => {
    it('should upload', () => {
      const file: File = new File(['file'], 'file.png', {
        type: 'image/png',
      });
      const type: ConfigImageType = 'square_logo';

      service.upload(file, type);

      expect((service as any).api.upload).toHaveBeenCalledWith(
        'api/v3/multi-tenant/configs/image/upload',
        {
          file: file,
          type: type,
        },
        {
          upload: true,
        }
      );
    });
  });

  describe('validateFileType', () => {
    it('should validate file type is image', () => {
      expect(
        service.validateFileType(
          new File(['file'], 'file.png', {
            type: 'image/png',
          })
        )
      ).toBeTrue();
    });

    it('should validate file type is not text', () => {
      expect(
        service.validateFileType(
          new File(['file'], 'file.png', {
            type: 'text/plain',
          })
        )
      ).toBeFalse();
    });

    it('should validate file type is not a video', () => {
      expect(
        service.validateFileType(
          new File(['file'], 'file.png', {
            type: 'video/mp4',
          })
        )
      ).toBeFalse();
    });
  });
});
