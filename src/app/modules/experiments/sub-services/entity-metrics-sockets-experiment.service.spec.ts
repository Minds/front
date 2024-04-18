import { EntityMetricsSocketsExperimentService } from './entity-metrics-sockets-experiment.service';

export let experimentsServiceMock = new (function () {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

describe('EntityMetricsSocketsExperimentService', () => {
  let service: EntityMetricsSocketsExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new EntityMetricsSocketsExperimentService(experimentsServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  // it('should return true if experiment is active', () => {
  //   (service as any).experiments.hasVariation.and.returnValue(true);
  //   expect(service.isActive()).toBeTruthy();
  //   expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
  //     'engine-1218-metrics-sockets',
  //     true
  //   );
  // });

  // it('should return false if experiment is NOT active', () => {
  //   (service as any).experiments.hasVariation.and.returnValue(false);
  //   expect(service.isActive()).toBeFalsy();
  //   expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
  //     'engine-1218-metrics-sockets',
  //     true
  //   );
  // });
});
