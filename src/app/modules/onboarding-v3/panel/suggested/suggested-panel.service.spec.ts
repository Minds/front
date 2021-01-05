import { FeedsService } from '../../../../common/services/feeds.service';
import { MockService } from '../../../../utils/mock';
import { OnboardingV3SuggestionsPanelService } from './suggested-panel.service';

const feedsServiceMock: any = MockService(FeedsService);

describe('OnboardingV3SuggestionsPanelService', () => {
  let service: OnboardingV3SuggestionsPanelService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new OnboardingV3SuggestionsPanelService(feedsServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should call feeds endpoint for channels for channel type', () => {
    service.load('channels');
    expect((service as any).feeds.setEndpoint).toHaveBeenCalledWith(
      'api/v2/feeds/global/top/channels'
    );
  });

  it('should call feeds endpoint for groups for groups type', () => {
    service.load('groups');
    expect((service as any).feeds.setEndpoint).toHaveBeenCalledWith(
      'api/v2/feeds/global/top/groups'
    );
  });

  it('should call to clear the feed', () => {
    service.clear();
    expect((service as any).feeds.clear).toHaveBeenCalled();
  });
});
