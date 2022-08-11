import { BehaviorSubject } from 'rxjs';
import { OnboardingV3TagsService } from './tags.service';

let apiMock = new (function() {
  this.get = jasmine.createSpy('get');
})();

let defaultTagsV2ExperimentMock = new (function() {
  this.isActive = jasmine.createSpy('isActive');
})();

describe('OnboardingV3TagsService', () => {
  let service: OnboardingV3TagsService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new OnboardingV3TagsService(apiMock, defaultTagsV2ExperimentMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should load tags with appropriate limit when v2 default tags experiment is active', () => {
    (service as any).defaultTagsV2Experiment.isActive.and.returnValue(true);
    (service as any).api.get.and.returnValue(new BehaviorSubject<any[]>([]));

    service.loadTags();

    expect((service as any).api.get).toHaveBeenCalledWith(
      'api/v2/hashtags/suggested',
      {
        trending: 0,
        defaults: 1,
        limit: 24,
      },
      3
    );
  });

  it('should load tags with appropriate limit when no v2 default tags experiment is active', () => {
    (service as any).defaultTagsV2Experiment.isActive.and.returnValue(false);
    (service as any).api.get.and.returnValue(new BehaviorSubject<any[]>([]));

    service.loadTags();

    expect((service as any).api.get).toHaveBeenCalledWith(
      'api/v2/hashtags/suggested',
      {
        trending: 0,
        defaults: 1,
        limit: 15,
      },
      3
    );
  });
});
