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

  it('should get config from api', (done: DoneFn) => {
    const mockConfig: GetTwitterConfigResponse = {
      twitter_oauth2_connected: true,
    };

    (service as any).api.get.and.returnValue(of(mockConfig));

    service.config$.subscribe((config: TwitterConfig) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/twitter/config'
      );
      expect(config).toEqual(mockConfig);
      done();
    });
  });

  it('should show error if there is an error loading config from api', (done: DoneFn) => {
    (service as any).api.get.and.throwError('error');

    service.config$.subscribe((config: TwitterConfig) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/twitter/config'
      );
      expect(console.error).toHaveBeenCalled();
      expect((service as any).toast.error).toHaveBeenCalledWith(
        'An unexpected error has occurred getting your twitter configuration'
      );
      done();
    });
  });

  it('should get auth URL from api', (done: DoneFn) => {
    const mockPath: string = '/test';
    const authUrl: string = 'https://authUrl.com';

    const mockResponse: GetTwitterOauthTokenResponse = {
      authorization_url: authUrl,
    };

    service.postAuthRedirectPath$.next(mockPath);
    (service as any).api.get.and.returnValue(of(mockResponse));

    service.authUrl$.subscribe((path: string) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/twitter/request-oauth-token',
        {
          redirectPath: mockPath,
        }
      );
      expect(path).toBe(authUrl);
      done();
    });
  });

  it('should show error if there is an error getting auth url from api', (done: DoneFn) => {
    const mockPath: string = '/test2';
    service.postAuthRedirectPath$.next(mockPath);

    (service as any).api.get.and.throwError('error');

    service.authUrl$.subscribe((path: string) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/twitter/request-oauth-token',
        {
          redirectPath: mockPath,
        }
      );
      expect(console.error).toHaveBeenCalled();
      expect((service as any).toast.error).toHaveBeenCalledWith(
        'An unexpected error has occurred getting your authorization link'
      );
      done();
    });
  });

  it('should get whether user is connected from config', (done: DoneFn) => {
    const mockConfig: GetTwitterConfigResponse = {
      twitter_oauth2_connected: true,
    };

    (service as any).api.get.and.returnValue(of(mockConfig));

    service.isConnected$.subscribe((isConnected: boolean) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/twitter/config'
      );
      expect(isConnected).toBe(true);
      done();
    });
  });
});
