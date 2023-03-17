import { fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { BoostFeedOpts } from '../../../modules/newsfeed/services/boost-feed.service';
import { FeaturedContentService } from './featured-content.service';

export let boostFeedServiceMock = new (function() {
  this.feed$ = of(new BehaviorSubject<Object>(null));
  this.init = jasmine.createSpy('init');
})();

describe('FeaturedContentService', () => {
  let service: FeaturedContentService;

  beforeEach(() => {
    service = new FeaturedContentService(boostFeedServiceMock);
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
});
