import {
  BoostFeedOpts,
  BoostFeedService,
} from '../../../modules/newsfeed/services/boost-feed.service';

export let feedsServiceMock = new (function() {
  this.setEndpoint = jasmine.createSpy('setEndpoint').and.returnValue(this);
  this.setParams = jasmine.createSpy('setParams').and.returnValue(this);
  this.setLimit = jasmine.createSpy('setLimit').and.returnValue(this);
  this.setOffset = jasmine.createSpy('setOffset').and.returnValue(this);
  this.fetch = jasmine.createSpy('fetch').and.returnValue(this);
})();

export let dynamicBoostExperimentMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

export let sessionMock = new (function() {})();

describe('BoostFeedService', () => {
  let service: BoostFeedService;

  beforeEach(() => {
    service = new BoostFeedService(
      feedsServiceMock,
      dynamicBoostExperimentMock,
      sessionMock
    );
    (service as any).initialised = false;
    (service as any).servedByGuid = false;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch feed', () => {
    service.init();

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
  });

  it('should fetch feed for a provided servedByGuid', () => {
    const servedByGuid: string = '321';
    const opts: BoostFeedOpts = { servedByGuid: servedByGuid };
    service.init(opts);

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
  });
});
