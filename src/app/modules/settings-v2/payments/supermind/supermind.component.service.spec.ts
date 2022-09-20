import { SettingsV2SupermindService } from './supermind.component.service';
import {
  SupermindConfig,
  SupermindSettings,
  SupermindSettingsPostApiResponse,
} from './supermind.types';
import { of } from 'rxjs';

describe('SettingsV2SupermindService', () => {
  let service: SettingsV2SupermindService;

  let apiMock = new (function() {
    this.get = jasmine.createSpy('get').and.returnValue(
      of({
        min_offchain_tokens: 1,
        min_cash: 10,
      })
    );
    this.post = jasmine.createSpy('post');
  })();

  let toasterMock = new (function() {
    this.error = jasmine.createSpy('error');
  })();

  let configMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  beforeEach(() => {
    service = new SettingsV2SupermindService(apiMock, toasterMock, configMock);
  });

  afterEach(() => {
    (service as any).api.get.calls.reset();
    (service as any).api.post.calls.reset();
    (service as any).toaster.error.calls.reset();
    (service as any).config.get.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get settings from API', (done: DoneFn) => {
    service.settings$.subscribe((settings: SupermindSettings) => {
      expect(settings.min_offchain_tokens).toBe(1);
      expect(settings.min_cash).toBe(10);
      done();
    });
  });

  it('should update settings via API', (done: DoneFn) => {
    (service as any).api.post.and.returnValue(of({}));
    service
      .updateSettings$({
        min_offchain_tokens: 1,
        min_cash: 10,
      })
      .subscribe((response: SupermindSettingsPostApiResponse) => {
        expect(response).toEqual({});
        done();
      });
  });

  it('should get global config', () => {
    const configValues: SupermindConfig = {
      min_thresholds: {
        min_offchain_tokens: 1,
        min_cash: 10,
      },
    };
    (service as any).config.get.and.returnValue(configValues);
    expect(service.getConfig()).toEqual(configValues);
  });
});
