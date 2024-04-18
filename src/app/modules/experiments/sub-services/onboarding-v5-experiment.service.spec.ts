import { OnboardingV5ExperimentService } from './onboarding-v5-experiment.service';

export let experimentsServiceMock = new (function () {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

describe('OnboardingV5ExperimentService', () => {
  let service: OnboardingV5ExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new OnboardingV5ExperimentService(experimentsServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if enrollment experiment is active', () => {
    (service as any).experiments.hasVariation.and.returnValue(true);
    expect(service.isEnrollmentActive()).toBeTruthy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      (service as any).ENROLLMENT_EXPERIMENT_ID,
      true
    );
  });

  it('should return false if enrollment experiment is NOT active', () => {
    (service as any).experiments.hasVariation.and.returnValue(false);
    expect(service.isEnrollmentActive()).toBeFalsy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      (service as any).ENROLLMENT_EXPERIMENT_ID,
      true
    );
  });

  it('should return true if global feature experiment is active', () => {
    (service as any).experiments.hasVariation.and.returnValue(true);
    expect(service.isGlobalOnSwitchActive()).toBeTruthy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      (service as any).GLOBAL_ON_SWITCH_EXPERIMENT_ID,
      true
    );
  });

  it('should return false if global feature experiment is NOT active', () => {
    (service as any).experiments.hasVariation.and.returnValue(false);
    expect(service.isGlobalOnSwitchActive()).toBeFalsy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      (service as any).GLOBAL_ON_SWITCH_EXPERIMENT_ID,
      true
    );
  });
});
