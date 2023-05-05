import { SidebarV2ExperimentService } from './sidebar-v2-experiment.service';

let experimentsServiceMock = new (function() {
  this.hasVariation = jasmine.createSpy('hasVariation');
})();

describe('SidebarV2ExperimentService', () => {
  let service: SidebarV2ExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new SidebarV2ExperimentService(experimentsServiceMock);
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
      'front-5924-sidebar-v2',
      true
    );
  });

  it('should return false if experiment is NOT active', () => {
    (service as any).experiments.hasVariation.and.returnValue(false);
    expect(service.isActive()).toBeFalsy();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
      'front-5924-sidebar-v2',
      true
    );
  });
});
