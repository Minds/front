import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';
import { DiscoveryService } from '../discovery.service';
import { DiscoveryFeedsService } from './feeds.service';
import { MockService } from '../../../utils/mock';
import { NSFWSelectorService } from '../../../common/components/nsfw-selector/nsfw-selector.service';
import { BehaviorSubject } from 'rxjs';

describe('DiscoveryFeedsService', () => {
  let service: DiscoveryFeedsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiscoveryFeedsService,
        { provide: FeedsService, useValue: MockService(FeedsService) },
        {
          provide: NSFWSelectorConsumerService,
          useValue: MockService(NSFWSelectorService),
        },
        {
          provide: DiscoveryService,
          useValue: MockService(DiscoveryService, {
            has: ['isPlusPage$', 'isWireSupportPage$'],
            props: {
              isPlusPage$: { get: () => new BehaviorSubject<boolean>(false) },
              isWireSupportPage$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(DiscoveryFeedsService);
    service.nsfw$.next([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load function', () => {
    it('should call with top algorithm and all content type if not on Plus page and algorithm is preferred', async () => {
      (service as any).discoveryService.isPlusPage$.next(false);
      service.filter$.next('preferred');
      service.type$.next('all');

      (service as any).feedsService.setEndpoint.and.returnValue(
        service.feedsService
      );
      (service as any).feedsService.setParams.and.returnValue(
        service.feedsService
      );

      await service.load();

      expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
        'api/v2/feeds/global/topV2/all'
      );
      expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
        all: 0,
        period: 'relevant',
        nsfw: '',
        period_fallback: 0,
        plus: false,
        wire_support_tier_only: false,
      });
      expect((service as any).feedsService.fetch).toHaveBeenCalled();
    });

    it('should call with top algorithm and all content type if not on Plus page and algorithm is not preferred', async () => {
      (service as any).discoveryService.isPlusPage$.next(false);
      service.filter$.next('other');
      service.type$.next('all');

      (service as any).feedsService.setEndpoint.and.returnValue(
        service.feedsService
      );
      (service as any).feedsService.setParams.and.returnValue(
        service.feedsService
      );

      await service.load();

      expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
        'api/v2/feeds/global/top/all'
      );
      expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
        all: 0,
        period: 'relevant',
        nsfw: '',
        period_fallback: 0,
        plus: false,
        wire_support_tier_only: false,
      });
      expect((service as any).feedsService.fetch).toHaveBeenCalled();
    });

    it('should call with topV2 algorithm and all content type if on Plus page and algorithm is preferred', async () => {
      (service as any).discoveryService.isPlusPage$.next(true);
      service.filter$.next('preferred');
      service.type$.next('all');

      (service as any).feedsService.setEndpoint.and.returnValue(
        service.feedsService
      );
      (service as any).feedsService.setParams.and.returnValue(
        service.feedsService
      );

      await service.load();

      expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
        'api/v2/feeds/global/topV2/all'
      );
      expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
        all: 1,
        period: 'relevant',
        nsfw: '',
        period_fallback: 0,
        plus: true,
        wire_support_tier_only: false,
      });
      expect((service as any).feedsService.fetch).toHaveBeenCalled();
    });

    it('should call with top algorithm and all content type if on Plus page and algorithm is not in allowedPlusAlgorithms', async () => {
      (service as any).discoveryService.isPlusPage$.next(true);
      service.filter$.next('other');
      service.type$.next('all');

      (service as any).feedsService.setEndpoint.and.returnValue(
        service.feedsService
      );
      (service as any).feedsService.setParams.and.returnValue(
        service.feedsService
      );

      await service.load();

      expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
        'api/v2/feeds/global/top/all'
      );
      expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
        all: 1,
        period: 'relevant',
        nsfw: '',
        period_fallback: 0,
        plus: true,
        wire_support_tier_only: false,
      });
      expect((service as any).feedsService.fetch).toHaveBeenCalled();
    });

    it('should call with latest algorithm and all content type if on Plus page and algorithm is latest', async () => {
      (service as any).discoveryService.isPlusPage$.next(true);
      service.filter$.next('latest');
      service.type$.next('all');

      (service as any).feedsService.setEndpoint.and.returnValue(
        service.feedsService
      );
      (service as any).feedsService.setParams.and.returnValue(
        service.feedsService
      );

      await service.load();

      expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
        'api/v2/feeds/global/latest/all'
      );
      expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
        all: 1,
        period: 'relevant',
        nsfw: '',
        period_fallback: 0,
        plus: true,
        wire_support_tier_only: false,
      });
      expect((service as any).feedsService.fetch).toHaveBeenCalled();
    });
  });
});
