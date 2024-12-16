import { NewsfeedService } from './newsfeed.service';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { NSFWSelectorComponent } from '../../../common/components/nsfw-selector/nsfw-selector.component';
import { MockService } from '../../../utils/mock';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';
import { analyticsServiceMock } from '../../../../tests/analytics-service-mock.spec';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { AnalyticsService } from '../../../services/analytics';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

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
      imports: [],
      providers: [
        {
          provide: Client,
          useValue: clientMock,
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        {
          provide: NSFWSelectorConsumerService,
          useValue: NSFWSelectorServiceMock,
        },
        {
          provide: AnalyticsService,
          useValue: analyticsServiceMock,
        },
        NewsfeedService,
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(NewsfeedService);
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

  it('should record a boosted activity view stop in a channel', () => {
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
  });
});
