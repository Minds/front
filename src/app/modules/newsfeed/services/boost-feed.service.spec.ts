import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  BoostFeedOpts,
  BoostFeedService,
} from '../../../modules/newsfeed/services/boost-feed.service';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { BehaviorSubject } from 'rxjs';

describe('BoostFeedService', () => {
  let service: BoostFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BoostFeedService,
        {
          provide: FeedsService,
          useValue: new (function() {
            this.setEndpoint = jasmine
              .createSpy('setEndpoint')
              .and.returnValue(this);
            this.setParams = jasmine
              .createSpy('setParams')
              .and.returnValue(this);
            this.setLimit = jasmine.createSpy('setLimit').and.returnValue(this);
            this.setOffset = jasmine
              .createSpy('setOffset')
              .and.returnValue(this);
            this.fetch = jasmine.createSpy('fetch').and.returnValue(this);
            this.clear = jasmine.createSpy('clear').and.returnValue(this);
            this.loadMore = jasmine.createSpy('loadMore').and.returnValue(this);

            this.feed = new BehaviorSubject<BehaviorSubject<Object>[]>([]);
            this.inProgress = new BehaviorSubject<boolean>(false);
            this.offset = new BehaviorSubject<number>(0);
            this.feedLength = 12;
            this.canFetchMore = true;
          })(),
        },
        {
          provide: DynamicBoostExperimentService,
          useValue: MockService(DynamicBoostExperimentService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
      ],
    });

    service = TestBed.inject(BoostFeedService);

    (service as any).initialised = false;
    (service as any).servedByGuid = false;

    (service as any).dynamicBoostExperiment.isActive.and.returnValue(true);

    (service as any).feedsService.canFetchMore = true;
    (service as any).feedsService.feedLength = 12;
    (service as any).feedsService.offset.next(0);
    (service as any).feedsService.inProgress.next(false);

    (service as any).feedsService.setEndpoint.calls.reset();
    (service as any).feedsService.setParams.calls.reset();
    (service as any).feedsService.setLimit.calls.reset();
    (service as any).feedsService.setOffset.calls.reset();
    (service as any).feedsService.fetch.calls.reset();
    (service as any).feedsService.clear.calls.reset();
    (service as any).feedsService.loadMore.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch feed', fakeAsync(() => {
    service.init();
    tick();

    expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
      'api/v3/boosts/feed'
    );
    expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
      location: 1,
      show_boosts_after_x: 604800,
    });
    expect((service as any).feedsService.setLimit).toHaveBeenCalledWith(12);
    expect((service as any).feedsService.setOffset).toHaveBeenCalledWith(0);
    expect((service as any).feedsService.fetch).toHaveBeenCalled();
  }));

  it('should fetch feed for a provided servedByGuid', fakeAsync(() => {
    const servedByGuid: string = '321';
    const opts: BoostFeedOpts = { servedByGuid: servedByGuid };
    service.init(opts);
    tick();

    expect((service as any).feedsService.setEndpoint).toHaveBeenCalledWith(
      'api/v3/boosts/feed'
    );
    expect((service as any).feedsService.setParams).toHaveBeenCalledWith({
      location: 1,
      show_boosts_after_x: 604800,
      served_by_guid: servedByGuid,
    });
    expect((service as any).feedsService.setLimit).toHaveBeenCalledWith(12);
    expect((service as any).feedsService.setOffset).toHaveBeenCalledWith(0);
    expect((service as any).feedsService.fetch).toHaveBeenCalled();
  }));

  it('should refresh the feed', () => {
    service.refreshFeed();
    expect((service as any).feedsService.clear).toHaveBeenCalled();
    expect((service as any).feedsService.fetch).toHaveBeenCalled();
  });

  it('should not refresh the feed if in progress', () => {
    (service as any).feedsService.inProgress.next(true);
    service.refreshFeed();
    expect((service as any).feedsService.clear).not.toHaveBeenCalled();
    expect((service as any).feedsService.fetch).not.toHaveBeenCalled();
  });

  it('should load next and fetch', () => {
    (service as any).feedsService.feedLength = 1;
    (service as any).feedsService.canFetchMore = true;
    (service as any).feedsService.inProgress.next(false);
    (service as any).feedsService.offset.next(13);

    service.loadNext();

    expect((service as any).feedsService.fetch).toHaveBeenCalled();
    expect((service as any).feedsService.loadMore).toHaveBeenCalled();
  });

  it('should load next and NOT fetch when cannot fetch more', () => {
    (service as any).feedsService.canFetchMore = false;
    (service as any).feedsService.inProgress.next(false);
    (service as any).feedsService.offset.next(12);

    service.loadNext();

    expect((service as any).feedsService.fetch).not.toHaveBeenCalled();
    expect((service as any).feedsService.loadMore).toHaveBeenCalled();
  });

  it('should load next and NOT fetch when in progress', () => {
    (service as any).feedsService.canFetchMore = true;
    (service as any).feedsService.inProgress.next(true);
    (service as any).feedsService.offset.next(12);

    service.loadNext();

    expect((service as any).feedsService.fetch).not.toHaveBeenCalled();
    expect((service as any).feedsService.loadMore).toHaveBeenCalled();
  });

  it('should load next and NOT fetch when offset is not greater than feed length', () => {
    (service as any).feedsService.canFetchMore = true;
    (service as any).feedsService.inProgress.next(false);
    (service as any).feedsService.offset.next(11);

    service.loadNext();

    expect((service as any).feedsService.fetch).not.toHaveBeenCalled();
    expect((service as any).feedsService.loadMore).toHaveBeenCalled();
  });

  it('should reset the feed', () => {
    (service as any).initialised = true;

    service.reset();

    expect((service as any).feedsService.clear).toHaveBeenCalled();
    expect((service as any).initialised).toBe(false);
  });
});
