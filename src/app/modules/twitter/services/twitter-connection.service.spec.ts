import { TwitterConnectionService } from './twitter-connection.service';
import {
  GetTwitterConfigResponse,
  GetTwitterOauthTokenResponse,
  TwitterConfig,
} from './twitter-connection.types';
import { of } from 'rxjs';

describe('TwitterConnectionService', () => {
  let service: TwitterConnectionService;

  let apiMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  let toastMock = new (function() {
    this.error = jasmine.createSpy('error');
  })();

  beforeEach(() => {
    service = new TwitterConnectionService(apiMock, toastMock);
    spyOn(console, 'error');
  });

  afterEach(() => {
    (service as any).api.get.calls.reset();
    (service as any).toast.error.calls.reset();

    (service as any).api.get.and.returnValue(of(null));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get whether user is connected from config', (done: DoneFn) => {
    const mockConfig: GetTwitterConfigResponse = {
      twitter_oauth2_connected: true,
    };

    (service as any).api.get.and.returnValue(of(mockConfig));

    service.isConnected().then(isConnected => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/twitter/config'
      );
      expect(isConnected).toBe(true);
      done();
    });
  });
});
