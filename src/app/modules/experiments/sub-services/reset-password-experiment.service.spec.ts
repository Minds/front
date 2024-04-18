import { ResetPasswordExperimentService } from './reset-password-experiment.service';

export let experimentsServiceMock = new (function () {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

describe('ResetPasswordExperimentService', () => {
  let service: ResetPasswordExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new ResetPasswordExperimentService(experimentsServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if experiment is active', () => {
    (service as any).experiments.hasVariation.and.returnValue(true);
    expect(service.isActive()).toBeTruthy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      'front-5986-reset-password',
      true
    );
  });

  it('should return false if experiment is NOT active', () => {
    (service as any).experiments.hasVariation.and.returnValue(false);
    expect(service.isActive()).toBeFalsy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      'front-5986-reset-password',
      true
    );
  });
});
