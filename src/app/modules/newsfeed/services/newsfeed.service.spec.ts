import { NewsfeedService } from './newsfeed.service';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { NSFWSelectorComponent } from '../../../common/components/nsfw-selector/nsfw-selector.component';
import { MockService } from '../../../utils/mock';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';
import { analyticsServiceMock } from '../../../../tests/analytics-service-mock.spec';

describe('NewsfeedService', () => {
  let service: NewsfeedService;
  let NSFWSelectorServiceMock: any = MockService(
    NSFWSelectorConsumerService,
    {}
  );

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [
        {
          value: NSFWSelectorConsumerService,
          useValue: NSFWSelectorServiceMock,
        },
      ],
    });

    service = new NewsfeedService(
      clientMock,
      sessionMock,
      NSFWSelectorServiceMock,
      analyticsServiceMock
    );
    clientMock.response = {};
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should record an activity view in newsfeed', fakeAsync(() => {
    const url: string = 'api/v2/analytics/views/activity/123';
    clientMock.response[url] = { status: 'success' };

    const entity: any = {
      guid: 123,
    };

    service.recordView(entity);
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(url);
  }));

  it('should record a boosted activity view in the newsfeed', fakeAsync(() => {
    const url: string = 'api/v2/analytics/views/boost/1234';
    clientMock.response[url] = { status: 'success' };

    const entity: any = {
      guid: 123,
      boosted_guid: 1234,
    };

    service.recordView(entity);
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(url);
  }));

  it('should record a boosted activity view stop in the newsfeed', fakeAsync(() => {
    const url: string = 'api/v2/analytics/views/boost/1234/stop';
    clientMock.response[url] = { status: 'success' };

    const entity: any = {
      guid: 123,
      boosted_guid: 1234,
    };

    service.recordView(entity, false);
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(url);
  }));

  it('should record a boosted activity view in a channel', fakeAsync(() => {
    const url: string = 'api/v2/analytics/views/boost/1234/456';
    clientMock.response[url] = { status: 'success' };

    const entity: any = {
      guid: 123,
      boosted_guid: 1234,
    };
    const channel: any = {
      guid: '456',
    };

    service.recordView(entity, true, channel);
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(url);
  }));

  it('should record a boosted activity view stop in a channel', fakeAsync(() => {
    const url: string = 'api/v2/analytics/views/boost/1234/456/stop';
    clientMock.response[url] = { status: 'success' };

    const entity: any = {
      guid: 123,
      boosted_guid: 1234,
    };
    const channel: any = {
      guid: '456',
    };

    service.recordView(entity, false, channel);
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(url);
  }));
});
