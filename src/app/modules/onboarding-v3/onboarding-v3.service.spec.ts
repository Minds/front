import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../common/api/api.service';
import { MockService } from '../../utils/mock';
import { OnboardingV3Service } from './onboarding-v3.service';

describe('OnboardingV3Service', () => {
  let service: OnboardingV3Service;

  const apiMock: any = MockService(ApiService, {
    get() {
      return new BehaviorSubject<any>({ status: 'success' });
    },
  });

  const stackableModalMock = new (function() {
    this.present = jasmine.createSpy('present');
  })();

  const tagsServiceMock = new (function() {
    this.hasSetTags = jasmine.createSpy('hasSetTags');
  })();

  const emailConfirmationMock = new (function() {
    this.success$ = new BehaviorSubject<boolean>(false);
  })();

  beforeEach(() => {
    service = new OnboardingV3Service(
      new (() => {})(),
      stackableModalMock,
      apiMock,
      emailConfirmationMock,
      tagsServiceMock
    );
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should call to api on load', () => {
    service.load();
    expect((service as any).api.get).toHaveBeenCalled();
  });
});
