import { clientMock } from '../../../../tests/client-mock.spec';
import { configMock } from '../../../../tests/config-mock-service.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { toastServiceMock } from '../../../modules/auth/multi-factor-auth/services/multi-factor-auth.service.spec';
import { EmailConfirmationService } from './email-confirmation.service';

describe('EmailConfirmationService', () => {
  let service: EmailConfirmationService;

  beforeEach(() => {
    service = new EmailConfirmationService(
      clientMock,
      toastServiceMock,
      sessionMock,
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

  it('should call to confirm an email address', async () => {
    service.success$.next(false);
    clientMock.response = { status: 'success' };

    const success = await service.confirm();

    expect(success).toBeTruthy();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v3/email/confirm'
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
    expect(service.success$.getValue()).toBeFalsy();
  });
});
