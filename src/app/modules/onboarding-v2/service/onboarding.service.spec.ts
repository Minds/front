import { fakeAsync } from '@angular/core/testing';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { OnboardingV2Service } from './onboarding.service';

describe('OnboardingV2Service', () => {
  let service: OnboardingV2Service;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new OnboardingV2Service(clientMock, sessionMock);
    clientMock.response = {};
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should check progress', fakeAsync(() => {
    const url = 'api/v2/onboarding/progress';

    clientMock.response[url] = {
      status: 'success',
      completed_items: [
        'suggested_hashtags',
        'token_verification',
        'dob',
        'location',
        'avatar',
      ],
      all_items: [
        'suggested_hashtags',
        'token_verification',
        'dob',
        'location',
        'avatar',
      ],
      show_onboarding: false,
    };

    service.checkProgress();
    jasmine.clock().tick(10);

    expect(clientMock.get).toHaveBeenCalled();
    const args = clientMock.get.calls.mostRecent().args;
    expect(args[0]).toBe(url);

    expect(service.completedPercentage).toBe(100);
  }));

  it('should follow all onboarding steps, because it does not have any progress', fakeAsync(() => {
    spyOn(service.close, 'emit');
    spyOn(service.slideChanged, 'emit');

    const url = 'api/v2/onboarding/progress';

    clientMock.response[url] = {
      status: 'success',
      completed_items: [],
      all_items: [
        'suggested_hashtags',
        'token_verification',
        'dob',
        'location',
        'avatar',
      ],
      show_onboarding: true,
    };

    service.checkProgress();
    jasmine.clock().tick(10);

    expect(service.currentSlide).toBe(-1);

    service.next();

    expect(service.slideChanged.emit).toHaveBeenCalled();
    expect(service.currentSlide).toBe(0);

    service.next();

    expect(service.slideChanged.emit).toHaveBeenCalled();
    expect(service.currentSlide).toBe(1);

    service.next();

    expect(service.slideChanged.emit).toHaveBeenCalled();
    expect(service.currentSlide).toBe(2);

    service.next();

    expect(service.close.emit).toHaveBeenCalled();
  }));

  it('should follow skip hashtags', fakeAsync(() => {
    spyOn(service.close, 'emit');
    spyOn(service.slideChanged, 'emit');

    const url = 'api/v2/onboarding/progress';

    clientMock.response[url] = {
      status: 'success',
      completed_items: ['suggested_hashtags'],
      all_items: [
        'suggested_hashtags',
        'token_verification',
        'dob',
        'location',
        'avatar',
      ],
      show_onboarding: true,
    };

    service.checkProgress();
    jasmine.clock().tick(10);

    expect(service.currentSlide).toBe(-1);

    service.next();

    expect(service.slideChanged.emit).toHaveBeenCalled();
    expect(service.currentSlide).toBe(1);
  }));
});
