import { clientMock } from '../../../../tests/client-mock.spec';
import { configMock } from '../../../../tests/config-mock-service.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { toastServiceMock } from '../../../modules/auth/multi-factor-auth/services/multi-factor-auth.service.spec';
import { EmailConfirmationService } from './email-confirmation.service';

export let modalServiceMock = new (function() {
  this.present = jasmine
    .createSpy('present')
    .and.returnValue(true);
})();

describe('EmailConfirmationService', () => {
  let service: EmailConfirmationService;

  beforeEach(() => {
    service = new EmailConfirmationService(
      clientMock,
      toastServiceMock,
      sessionMock,
      modalServiceMock,
      configMock
    );
  });

  afterEach(() => {
    clientMock.response = [];
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should call to verify an email address', async() => {
    service.success$.next(false);
    clientMock.response = { 'status': 'success' };
    
    const success = await service.verify();
    
    expect(success).toBeTruthy();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v3/two-factor/confirm-email'
    );
    expect(service.success$.getValue()).toBeTruthy();
  });

  it('should return false if unable to verify an email address', async() => {
    service.success$.next(false);
    clientMock.response = { 'status': 'error' };
    
    const success = await service.verify();
    
    expect(success).toBeFalsy();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v3/two-factor/confirm-email'
    );
    expect(service.success$.getValue()).toBeFalsy();
  });
});
