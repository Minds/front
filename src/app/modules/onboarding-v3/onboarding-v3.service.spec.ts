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

  const stackableModalMock: any = MockService(ApiService, {
    dismiss() {
      return true;
    },
  });

  beforeEach(() => {
    service = new OnboardingV3Service(
      new (() => {})(),
      new (() => {})(),
      stackableModalMock,
      apiMock
    );
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should call to api on load', () => {
    service.load();
    expect((service as any).api.get).toHaveBeenCalled();
  });

  it('it should call to dismiss stackable modal', () => {
    service.dismiss();
    expect((service as any).stackableModal.dismiss).toHaveBeenCalled();
  });
});
