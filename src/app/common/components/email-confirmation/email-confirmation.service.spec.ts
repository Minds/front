import { clientMock } from '../../../../tests/client-mock.spec';
import { configMock } from '../../../../tests/config-mock-service.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { toastServiceMock } from '../../../modules/auth/multi-factor-auth/services/multi-factor-auth.service.spec';
import { EmailConfirmationService } from './email-confirmation.service';

export let activityV2ExperimentServiceMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

export let feedNoticeMock = new (function() {
  this.dismiss = jasmine.createSpy('dismiss');
})();

export let tagsServiceMock = new (function() {
  this.hasSetTags = jasmine.createSpy('hasSetTags');
})();

export let onboardingV3Mock = new (function() {
  this.open = jasmine.createSpy('open');
})();

describe('EmailConfirmationService', () => {
  let service: EmailConfirmationService;

  beforeEach(() => {
    service = new EmailConfirmationService(
      clientMock,
      toastServiceMock,
      sessionMock,
      onboardingV3Mock,
      feedNoticeMock,
      tagsServiceMock,
      configMock
    );
  });

  afterEach(() => {
    clientMock.response = [];
    sessionMock.inject.calls.reset();
    (service as any).feedNotice.dismiss.calls.reset();
    (service as any).tagsService.hasSetTags.calls.reset();
    (service as any).onboardingV3.open.calls.reset();
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should call to confirm an email address', async () => {
    service.success$.next(false);
    clientMock.response = { status: 'success' };

    const success = await service.confirm();

    expect(success).toBeTruthy();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v3/email/confirm'
    );
    expect((service as any).session.inject).toHaveBeenCalled();
    expect((service as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'verify-email'
    );
    expect(service.success$.getValue()).toBeTruthy();
  });

  it('should return false if unable to confirm an email address', async () => {
    service.success$.next(false);
    clientMock.response = { status: 'error' };

    const success = await service.confirm();

    expect(success).toBeFalsy();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v3/email/confirm'
    );
    expect(sessionMock.inject).not.toHaveBeenCalled();
    expect((service as any).feedNotice.dismiss).not.toHaveBeenCalledWith(
      'verify-email'
    );
    expect((service as any).tagsService.hasSetTags).not.toHaveBeenCalled();
    expect((service as any).onboardingV3.open).not.toHaveBeenCalled();
    expect(service.success$.getValue()).toBeFalsy();
  });

  it('should open tags modal if user has not set tags on confirm', async () => {
    service.success$.next(false);
    clientMock.response = { status: 'success' };
    tagsServiceMock.hasSetTags.and.returnValue(false);

    const success = await service.confirm();

    expect((service as any).tagsService.hasSetTags).toHaveBeenCalled();
    expect((service as any).onboardingV3.open).toHaveBeenCalled();
  });
});
