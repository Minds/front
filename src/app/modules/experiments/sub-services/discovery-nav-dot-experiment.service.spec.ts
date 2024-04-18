import { DiscoveryNavDotExperimentService } from './discovery-nav-dot-experiment.service';

export let experimentsServiceMock = new (function () {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

describe('DiscoveryNavDotExperimentService', () => {
  let service: DiscoveryNavDotExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new DiscoveryNavDotExperimentService(experimentsServiceMock);
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
      'front-5938-discovery-nav-dot',
      true
    );
  });

  it('should return false if experiment is NOT active', () => {
    (service as any).experiments.hasVariation.and.returnValue(false);
    expect(service.isActive()).toBeFalsy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      'front-5938-discovery-nav-dot',
      true
    );
  });
});
