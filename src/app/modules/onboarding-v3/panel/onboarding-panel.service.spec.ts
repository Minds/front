import { BehaviorSubject } from 'rxjs';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { ApiService } from '../../../common/api/api.service';
import { MockService } from '../../../utils/mock';
import { OnboardingV3PanelService } from './onboarding-panel.service';
import { OnboardingV3TagsService } from './tags/tags.service';

let routerMock = new (function () {
  this.navigate = jasmine.createSpy('navigate');
})();

const tagsMock: any = MockService(OnboardingV3TagsService);

xdescribe('OnboardingV3PanelService', () => {
  let service: OnboardingV3PanelService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new OnboardingV3PanelService(tagsMock, routerMock, sessionMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should disable suggested hashtags when three are not selected', () => {
    service.currentStep$.next('SuggestedHashtagsStep');
    service.disableProgress$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should update dismiss observable on next step clicked when NOT on tag step', () => {
    service.currentStep$.next('WelcomeStep');
    (service as any).dismiss$.next(false);
    service.nextStep();
    (service as any).dismiss$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should update not update dismiss observable on next step clicked when IS on tag step', () => {
    service.currentStep$.next('SuggestedHashtagsStep');
    (service as any).dismiss$.next(false);
    service.nextStep();
    (service as any).dismiss$.subscribe((val) => {
      expect(val).toBeFalsy();
    });
    expect(service.currentStep$.getValue()).toBe('WelcomeStep');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/newsfeed/subscribed']);
  });
});
