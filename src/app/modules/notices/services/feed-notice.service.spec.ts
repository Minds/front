import { of } from 'rxjs';
import { configMock } from '../../../../tests/config-mock-service.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { apiServiceMock } from '../../../mocks/services/api-mock.spec';
import { FeedNoticeService } from './feed-notice.service';

describe('FeedNoticeService', () => {
  let service: FeedNoticeService;

  beforeEach(() => {
    service = new FeedNoticeService(
      sessionMock,
      apiServiceMock,
      compassServiceMock,
      configMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should get next showable notice when it is first in priority', () => {
    service.notices['verify-email'].shown = false;
    service.notices['verify-email'].completed = false;
    service.notices['verify-email'].dismissed = false;
    expect(service.getNextShowableNotice('top')).toBe('verify-email');
  });

  it('should get second showable notice when first priority but has been dismissed', () => {
    service.notices['verify-email'].shown = false;
    service.notices['verify-email'].completed = false;
    service.notices['verify-email'].dismissed = true;

    service.notices['build-your-algorithm'].shown = false;
    service.notices['build-your-algorithm'].completed = false;
    service.notices['build-your-algorithm'].dismissed = false;

    expect(service.getNextShowableNotice('top')).toBe('build-your-algorithm');
  });

  it('should get next showable notice when it is NOT first in priority', () => {
    service.notices['verify-email'].shown = true;
    service.notices['verify-email'].completed = true;
    service.notices['verify-email'].dismissed = true;

    service.notices['build-your-algorithm'].shown = false;
    service.notices['build-your-algorithm'].completed = false;
    service.notices['build-your-algorithm'].dismissed = false;

    expect(service.getNextShowableNotice('top')).toBe('build-your-algorithm');
  });

  it('should determine whether a notice IS already shown in a given position', () => {
    service.notices['verify-email'].shown = true;
    service.notices['verify-email'].completed = false;
    service.notices['verify-email'].dismissed = false;
    expect(service.hasShownNoticeInPosition('top')).toBeTruthy();

    service.notices['verify-email'].shown = false;
    service.notices['verify-email'].completed = false;
    service.notices['verify-email'].dismissed = false;
    expect(service.hasShownNoticeInPosition('top')).toBeFalsy();
  });

  it('should return if a given notice is shown or not', () => {
    service.notices['verify-email'].shown = false;
    expect((service as any).isShown('verify-email')).toBeFalsy();
    service.notices['build-your-algorithm'].shown = true;
    expect((service as any).isShown('build-your-algorithm')).toBeTruthy();
  });

  it('should set shown state', () => {
    service.setShown('verify-email', true);
    expect(service.notices['verify-email'].shown).toBeTruthy();
    service.setShown('verify-email', false);
    expect(service.notices['verify-email'].shown).toBeFalsy();
  });

  it('should return if a given notice is dismissed or not', () => {
    service.notices['verify-email'].dismissed = false;
    expect(service.isDismissed('verify-email')).toBeFalsy();
    service.notices['build-your-algorithm'].dismissed = true;
    expect(service.isDismissed('build-your-algorithm')).toBeTruthy();
  });

  it('should set dismissed state', () => {
    (service as any).api.put.and.returnValue(of({ status: 'success' }));

    service.setDismissed('verify-email', true);
    expect((service as any).api.put).toHaveBeenCalledOnceWith(
      'api/v3/dismissible-notices/verify-email'
    );
    expect(service.notices['verify-email'].dismissed).toBeTruthy();
    service.setDismissed('verify-email', false);
    expect((service as any).api.put).toHaveBeenCalledOnceWith(
      'api/v3/dismissible-notices/verify-email'
    );
    expect(service.notices['verify-email'].dismissed).toBeFalsy();
  });

  it('should return whether notice should show in a given position', () => {
    service.notices['verify-email'].position = 'top';
    service.notices['build-your-algorithm'].position = 'inline';

    expect(
      (service as any).shouldShowInPosition('verify-email', 'inline')
    ).toBeFalsy();
    expect(
      (service as any).shouldShowInPosition('verify-email', 'top')
    ).toBeTruthy();

    expect(
      (service as any).shouldShowInPosition('build-your-algorithm', 'inline')
    ).toBeTruthy();
    expect(
      (service as any).shouldShowInPosition('build-your-algorithm', 'top')
    ).toBeFalsy();
  });

  it('should check initial notice state', async () => {
    (service as any).fromEmailConfirmation = true;
    sessionMock.user.email_confirmed = true;

    (service as any).compass.answersProvided$.next(true);

    (service as any).api.get.and.returnValue(
      of({
        status: 'success',
        settings: [
          {
            notification_group: 'all',
            enabled: true,
          },
        ],
      })
    );

    await (service as any).checkNoticeState();

    expect(service.notices['verify-email'].completed).toBeTruthy();
    expect(service.notices['build-your-algorithm'].completed).toBeTruthy();
    expect(service.notices['enable-push-notifications'].completed).toBeTruthy();
    expect(service.updatedState$.getValue()).toBeTruthy();
  });

  it('should get a list of all showable notices by position', () => {
    service.notices['verify-email'].shown = false;
    service.notices['verify-email'].position = 'top';
    service.notices['verify-email'].completed = false;

    service.notices['build-your-algorithm'].shown = false;
    service.notices['build-your-algorithm'].position = 'top';
    service.notices['build-your-algorithm'].completed = false;

    service.notices['enable-push-notifications'].shown = false;
    service.notices['enable-push-notifications'].position = 'inline';
    service.notices['enable-push-notifications'].completed = false;

    expect((service as any).getShowableNoticesByPosition('top')).toEqual([
      'verify-email',
      'build-your-algorithm',
    ]);

    expect((service as any).getShowableNoticesByPosition('inline')).toEqual([
      'enable-push-notifications',
    ]);

    // should omit completed
    service.notices['verify-email'].completed = true;
    expect((service as any).getShowableNoticesByPosition('top')).toEqual([
      'build-your-algorithm',
    ]);

    // should omit shown.
    service.notices['verify-email'].completed = false;
    service.notices['verify-email'].shown = true;
    expect((service as any).getShowableNoticesByPosition('top')).toEqual([
      'build-your-algorithm',
    ]);
  });

  it('should return if a given notice is completed or not', () => {
    service.notices['verify-email'].completed = false;
    expect((service as any).isCompleted('verify-email')).toBeFalsy();
    service.notices['build-your-algorithm'].completed = true;
    expect((service as any).isCompleted('build-your-algorithm')).toBeTruthy();
  });

  it('should determine whether another notice has been shown already', () => {
    service.notices['verify-email'].shown = true;
    expect(service.hasShownANotice()).toBeTruthy();

    service.notices['verify-email'].shown = false;
    expect(service.hasShownANotice()).toBeFalsy();
  });

  it('should determine if user has already verified their email', () => {
    (service as any).fromEmailConfirmation = true;
    sessionMock.user.email_confirmed = true;
    expect((service as any).requiresEmailConfirmation()).toBeFalsy();
  });

  it('should determine if user has NOT already verified their email', () => {
    (service as any).fromEmailConfirmation = false;
    sessionMock.user.email_confirmed = false;
    expect((service as any).requiresEmailConfirmation()).toBeTruthy();
  });

  it('should determine if user has not filled out compass answers', async () => {
    (service as any).compass.answersProvided$.next(true);
    expect(await (service as any).hasCompletedCompassAnswers()).toBeTruthy();
  });

  it('should determine if user has filled out compass answers', async () => {
    (service as any).compass.answersProvided$.next(false);
    expect(await (service as any).hasCompletedCompassAnswers()).toBeFalsy();
  });

  it('should determine if user has push notifications enabled', async () => {
    (service as any).api.get.and.returnValue(
      of({
        status: 'success',
        settings: [
          {
            notification_group: 'all',
            enabled: true,
          },
        ],
      })
    );
    expect(await (service as any).hasPushNotificationsEnabled()).toBeTruthy();
  });

  it('should determine if user does NOT have push notifications enabled', async () => {
    (service as any).api.get.and.returnValue(
      of({
        status: 'success',
        settings: [
          {
            notification_group: 'all',
            enabled: false,
          },
        ],
      })
    );
    expect(await (service as any).hasPushNotificationsEnabled()).toBeFalsy();
  });

  it('should determine a notification has NOT been dismissed when no notifications have been dismissed', () => {
    const noticeName = 'build-your-algorithm';
    service.notices[noticeName].dismissed = false;
    service.notices['verify-email'].dismissed = false;
    service.notices['enable-push-notifications'].dismissed = false;
    sessionMock.user['dismissed_notices'] = [];

    expect((service as any).isNoticeDismissed(noticeName)).toBeFalsy();
  });

  it('should determine whether a notification has already been dismissed BUT dismissal is expired', () => {
    const noticeName = 'build-your-algorithm';
    sessionMock.user['dismissed_notices'] = [
      {
        id: noticeName,
        timestamp_ms: 1269542790000, // 2010
      },
    ];
    service.notices[noticeName].dismissed = false;
    service.notices['verify-email'].dismissed = false;
    service.notices['enable-push-notifications'].dismissed = false;

    expect((service as any).isNoticeDismissed(noticeName)).toBeFalsy();
  });

  it('should determine whether a notification has already been dismissed and dismissal has NOT expired', () => {
    const noticeName = 'build-your-algorithm';
    sessionMock.user['dismissed_notices'] = [
      {
        id: noticeName,
        timestamp_ms: new Date().getTime(),
      },
    ];
    service.notices[noticeName].dismissed = false;
    service.notices['verify-email'].dismissed = false;
    service.notices['enable-push-notifications'].dismissed = false;

    expect((service as any).isNoticeDismissed(noticeName)).toBeTruthy();
  });
});
