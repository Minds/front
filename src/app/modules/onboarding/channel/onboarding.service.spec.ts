import { ChannelOnboardingService } from './onboarding.service';
import { clientMock } from '../../../../tests/client-mock.spec';
import { fakeAsync } from '@angular/core/testing';
import { sessionMock } from '../../../../tests/session-mock.spec';

describe('ChannelOnboardingService', () => {
  let service: ChannelOnboardingService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new ChannelOnboardingService(clientMock, sessionMock);
    clientMock.response = {};

    const url = 'api/v2/onboarding/progress';
    clientMock.response[url] = {
      status: 'success',
      show_onboarding: true,
      all_items: ['item1', 'item2'],
      completed_items: ['item1'],
      creator_frequency: 'sometimes',
    };
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('it should go to the previous slide and emit an event', fakeAsync(async () => {
    service.currentSlide = 1;
    spyOn(service.onSlideChanged, 'emit').and.stub();
    service.previous();
    expect(service.currentSlide).toBe(0);
    expect(service.onSlideChanged.emit).toHaveBeenCalled();
  }));

  xit('it should go to the next slide and emit an event', fakeAsync(async () => {
    service.next();
    expect(service.currentSlide).toBe(1);
  }));

  it('it should reset the service', () => {
    service.reset();

    expect(service.completedPercentage).toEqual(-1);
    expect(service.completedItems).toEqual([]);
    expect(service.showOnboarding).toEqual(false);
    expect(service.pendingItems).toEqual([]);
    expect(service.currentSlide).toEqual(0);
    expect(service.completed).toEqual(false);
  });
});
