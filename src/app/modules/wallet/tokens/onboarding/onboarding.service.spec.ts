import { TokenOnboardingService } from './onboarding.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('TokenOnboardingService', () => {

  let service: TokenOnboardingService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new TokenOnboardingService();
  });

  afterEach(()=> {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should get slide', () => {
    expect(service.slide).toBeTruthy();
  });

  it('should get next slide', () => {
    service.next();
    expect(service.currentSlide).toBe(1);
  });

});
