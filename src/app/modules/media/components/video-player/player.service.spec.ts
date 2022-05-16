import { clientMock } from '../../../../../tests/client-mock.spec';
import { modalServiceMock } from '../../../../../tests/modal-service-mock.spec';
import { analyticsServiceMock } from '../../../newsfeed/activity/modal/modal-creator.service.spec';
import { VideoPlayerService } from './player.service';

describe('VideoPlayerService', () => {
  let service: VideoPlayerService;

  beforeEach(() => {
    service = new VideoPlayerService(
      clientMock,
      modalServiceMock,
      analyticsServiceMock,
      'browser'
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should call to track event on trackActionEvent call', () => {
    service.trackActionEventClick('video-player-unmuted');
    // Can't check snowplow call as its a package so check a call made
    // in the construction of that call is made.
    expect((service as any).analytics.getContexts).toHaveBeenCalled();
  });
});
