import { PlusUpgradeNoticeExperimentService } from './plus-upgrade-notice-experiment.service';

export let experimentsServiceMock = new (function() {
  this.run = jasmine.createSpy('run');
})();

describe('PlusUpgradeNoticeExperimentService', () => {
  let service: PlusUpgradeNoticeExperimentService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new PlusUpgradeNoticeExperimentService(experimentsServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should get active variation of experiment', () => {
    const variation = '2';
    (service as any).experiments.run.and.returnValue(variation);
    expect(service.getActiveVariation()).toBe(parseInt(variation));
  });

  it('should default to 0 if no active variation', () => {
    (service as any).experiments.run.and.returnValue(null);
    expect(service.getActiveVariation()).toBe(0);
  });
});
