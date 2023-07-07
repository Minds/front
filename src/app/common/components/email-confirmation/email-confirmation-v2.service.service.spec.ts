import { EmailConfirmationV2Service } from './email-confirmation-v2.service';
import { Session } from '../../../services/session';
import { FeedNoticeService } from '../../../modules/notices/services/feed-notice.service';
import { ApiResponse, ApiService } from '../../api/api.service';
import { of, take } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import userMock from '../../../mocks/responses/user.mock';

let apiServiceMock: jasmine.SpyObj<ApiService> = jasmine.createSpyObj<
  ApiService
>(['post']);

let sessionMock: jasmine.SpyObj<Session> = jasmine.createSpyObj<Session>([
  'getLoggedInUser',
  'inject',
]);

let feedNoticeServiceMock: jasmine.SpyObj<FeedNoticeService> = jasmine.createSpyObj<
  FeedNoticeService
>(['dismiss']);

describe('EmailConfirmationV2Service', () => {
  let service: EmailConfirmationV2Service;

  beforeEach(() => {
    service = new EmailConfirmationV2Service(
      apiServiceMock,
      sessionMock,
      feedNoticeServiceMock
    );
  });

  afterEach(() => {
    (service as any).session.getLoggedInUser.calls.reset();
    (service as any).session.inject.calls.reset();
    (service as any).feedNotice.dismiss.calls.reset();
    (service as any).api.post.calls.reset();

    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should call to send an email without existing key', (done: DoneFn) => {
    const response: ApiResponse = { status: 'success' };
    (service as any).api.post.and.returnValue(of(response));

    service
      .sendEmail()
      .pipe(take(1))
      .subscribe((val: ApiResponse): void => {
        expect((service as any).api.post).toHaveBeenCalledWith(
          'api/v3/email/send',
          null,
          undefined
        );
        expect(val).toEqual(response);
        done();
      });
  });

  it('should call to send an email with existing key', (done: DoneFn) => {
    const key: string = '~key~';
    const response: ApiResponse = { status: 'success' };
    (service as any).api.post.and.returnValue(of(response));

    service
      .sendEmail(key)
      .pipe(take(1))
      .subscribe((val: ApiResponse): void => {
        expect((service as any).api.post).toHaveBeenCalledWith(
          'api/v3/email/send',
          null,
          {
            headers: {
              'X-MINDS-EMAIL-2FA-KEY': key,
            },
          }
        );
        expect(val).toEqual(response);
        done();
      });
  });

  it('should call to submit a code', (done: DoneFn) => {
    const code: string = '123456';
    const key: string = '~key~';

    const response: ApiResponse = { status: 'success' };
    (service as any).api.post.and.returnValue(of(response));

    service
      .submitCode(code, key)
      .pipe(take(1))
      .subscribe((val: ApiResponse): void => {
        expect((service as any).api.post).toHaveBeenCalledWith(
          'api/v3/email/verify',
          null,
          {
            headers: {
              'X-MINDS-2FA-CODE': code,
              'X-MINDS-EMAIL-2FA-KEY': key,
            },
          }
        );
        expect(val).toEqual(response);
        done();
      });
  });

  it('should check if email confirmation is required', () => {
    let user: MindsUser = userMock;
    user.email_confirmed = false;
    (service as any).session.getLoggedInUser.and.returnValue(user);
    expect(service.requiresEmailConfirmation()).toBe(true);
  });

  it('should check if email confirmation is NOT required', () => {
    let user: MindsUser = userMock;
    user.email_confirmed = true;
    (service as any).session.getLoggedInUser.and.returnValue(user);
    expect(service.requiresEmailConfirmation()).toBe(false);
  });

  it('should update local confirmation state', () => {
    let user: MindsUser = userMock;
    user.email_confirmed = true;
    (service as any).session.getLoggedInUser.and.returnValue(user);
    service.updateLocalConfirmationState();
    expect((service as any).session.inject).toHaveBeenCalledWith(userMock);
    expect((service as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'verify-email'
    );
  });
});
