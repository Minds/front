import { BehaviorSubject } from 'rxjs';
import { OnboardingV3TagsService } from './tags.service';

let apiMock = new (function() {
  this.get = jasmine.createSpy('get');
})();

describe('OnboardingV3TagsService', () => {
  let service: OnboardingV3TagsService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new OnboardingV3TagsService(apiMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should load tags with appropriate limit', () => {
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
});
