import { clientMock } from '../../../../../tests/client-mock.spec';
import { modalServiceMock } from '../../../../../tests/modal-service-mock.spec';
import { analyticsServiceMock } from '../../../../../tests/analytics-service-mock.spec';
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
    const eventKey = 'video-player-unmuted';
    const mockContext = {
      schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
      data: {
        entity_guid: '123',
        entity_type: 'object',
        entity_subtype: 'video',
        entity_owner_guid: '123',
        entity_access_id: '2',
        entity_container_guid: '123',
      },
    };
    (service as any).analytics.buildEntityContext.and.returnValue(mockContext);

    service.trackClick(eventKey);

    expect((service as any).analytics.trackClick).toHaveBeenCalledWith(
      eventKey,
      [mockContext]
    );
  });
});
