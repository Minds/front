import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  BoostFeedOpts,
  BoostFeedService,
} from '../../../modules/newsfeed/services/boost-feed.service';
import { FeaturedContentService } from './featured-content.service';
import { MockService } from '../../../utils/mock';

describe('FeaturedContentService', () => {
  let service: FeaturedContentService;

  let mockEntities = [
    new BehaviorSubject<Object>({ guid: '123' }),
    new BehaviorSubject<Object>({ guid: '234' }),
    new BehaviorSubject<Object>({ guid: '345' }),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeaturedContentService,
        {
          provide: BoostFeedService,
          useValue: MockService(BoostFeedService, {
            has: ['feed$'],
            props: {
              feed$: {
                get: () =>
                  new BehaviorSubject<BehaviorSubject<Object>[]>(mockEntities),
              },
            },
          }),
        },
      ],
    });

    service = TestBed.inject(FeaturedContentService);
    (service as any).boostFeedService.feed$.next(mockEntities);
    (service as any).boostFeedService.loadNext.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should init with with options on manual onInit call', fakeAsync(() => {
    const opts: BoostFeedOpts = { servedByGuid: '123' };
    service.onInit(opts);
    tick();

    expect((service as any).boostFeedService.init).toHaveBeenCalledWith(opts);
  }));

  it('should fetch and call to load more', fakeAsync(() => {
    const offset: number = 1;
    service.offset = offset;
    service.maximumOffset = 2;

    expectAsync(service.fetch()).toBeResolvedTo(
      mockEntities[offset].getValue()
    );
    tick();

    expect((service as any).boostFeedService.loadNext).toHaveBeenCalled();
    expect((service as any).offset).toBe(offset + 1);
  }));

  it('should fetch and call to load more when max offset equals offset', fakeAsync(() => {
    const offset: number = 2;
    service.offset = offset;
    service.maximumOffset = 2;

    expectAsync(service.fetch()).toBeResolvedTo(
      mockEntities[offset].getValue()
    );
    tick();

    expect((service as any).boostFeedService.loadNext).toHaveBeenCalled();
    expect((service as any).offset).toBe(offset + 1);
  }));

  it('should not call to load more when fetching if offset is more than maximum offset', fakeAsync(() => {
    const offset: number = 2;
    service.offset = offset;
    service.maximumOffset = 1;

    expectAsync(service.fetch()).toBeResolvedTo(
      mockEntities[offset].getValue()
    );
    tick();

    expect((service as any).boostFeedService.loadNext).toHaveBeenCalled();
    expect((service as any).offset).toBe(offset + 1);
  }));
});
