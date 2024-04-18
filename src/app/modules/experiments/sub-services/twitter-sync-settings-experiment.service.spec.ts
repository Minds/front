import { TwitterSyncSettingsExperimentService } from './twitter-sync-settings-experiment.service';

export let experimentsServiceMock = new (function () {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

describe('TwitterSyncSettingsExperimentService', () => {
  let service: TwitterSyncSettingsExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new TwitterSyncSettingsExperimentService(experimentsServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be init', () => {
    expect(service).toBeTruthy();
  });

  // it('should return true if experiment is active', () => {
  //   (service as any).experiments.hasVariation.and.returnValue(true);
  //   expect(service.isActive()).toBeTruthy();
  //   expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
  //     'front-6032-twitter-sync-settings',
  //     true
  //   );
  // });

  // it('should return false if experiment is NOT active', () => {
  //   (service as any).experiments.hasVariation.and.returnValue(false);
  //   expect(service.isActive()).toBeFalsy();
  //   expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
  //     'front-6032-twitter-sync-settings',
  //     true
  //   );
  // });
});
