import { of } from 'rxjs';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { notificationsSettingsV2ServiceMock } from '../../../mocks/modules/settings-v2/account/notification-v3/notification-settings-v2-mock.spec';
import { FeedNoticeService } from './feed-notice.service';

export let feedNoticeDismissalService = new (function() {
  this.dismissNotice = jasmine.createSpy('dismissNotice').and.returnValue(this);
  this.isNoticeDismissed = jasmine
    .createSpy('isNoticeDismissed')
    .and.returnValue(true);
})();

export let emailConfirmationServiceMock = new (function() {
  this.requiresEmailConfirmation = jasmine
    .createSpy('requiresEmailConfirmation')
    .and.returnValue(true);
})();

export let activityV2ExperimentServiceMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

export let tagsServiceMock = new (function() {
  this.countTags = jasmine.createSpy('countTags').and.returnValue(0);
})();

describe('FeedNoticeService', () => {
  let service: FeedNoticeService;

  beforeEach(() => {
    service = new FeedNoticeService(
      feedNoticeDismissalService,
      compassServiceMock,
      notificationsSettingsV2ServiceMock,
      emailConfirmationServiceMock,
      activityV2ExperimentServiceMock
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
    service.notices['update-tags'].shown = true;
    expect((service as any).isShown('update-tags')).toBeTruthy();
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
    service.notices['update-tags'].dismissed = true;
    expect(service.isDismissed('update-tags')).toBeTruthy();
  });

  it('should set dismissed state', () => {
    service.updatedState$.next(false);
    service.notices['verify-email'].dismissed = false;
    service.notices['verify-email'].shown = true;

    service.dismiss('verify-email');

    expect(service.notices['verify-email'].dismissed).toBeTruthy();
    expect(service.notices['verify-email'].shown).toBeFalsy();
    expect(service.updatedState$.getValue()).toBeTruthy();
  });

  it('should return whether notice should show in a given position', () => {
    service.notices['verify-email'].position = 'top';
    service.notices['build-your-algorithm'].position = 'inline';
    service.notices['update-tags'].position = 'inline';

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

    expect(
      (service as any).shouldShowInPosition('update-tags', 'inline')
    ).toBeTruthy();
    expect(
      (service as any).shouldShowInPosition('update-tags', 'top')
    ).toBeFalsy();
  });

  it('should check initial notice state', async () => {
    (service as any).emailConfirmation.requiresEmailConfirmation.and.returnValue(
      false
    );
    (service as any).compass.hasCompletedCompassAnswers.and.returnValue(true);
    (service as any).notificationSettings.pushNotificationsEnabled$ = of(true);
    (service as any).tagsService.countTags.and.returnValue(1);

    await (service as any).checkNoticeState();

    expect(service.notices['verify-email'].completed).toBeTruthy();
    expect(service.notices['build-your-algorithm'].completed).toBeTruthy();
    expect(service.notices['enable-push-notifications'].completed).toBeTruthy();
    expect(service.notices['update-tags'].completed).toBeTruthy();
    expect(service.updatedState$.getValue()).toBeTruthy();
  });

  it('should get a list of all showable notices by position', () => {
    service.notices['verify-email'].shown = false;
    service.notices['verify-email'].position = 'top';
    service.notices['verify-email'].completed = false;
    service.notices['verify-email'].dismissed = false;

    service.notices['build-your-algorithm'].shown = false;
    service.notices['build-your-algorithm'].position = 'top';
    service.notices['build-your-algorithm'].completed = false;
    service.notices['build-your-algorithm'].dismissed = false;

    service.notices['enable-push-notifications'].shown = false;
    service.notices['enable-push-notifications'].position = 'inline';
    service.notices['enable-push-notifications'].completed = false;
    service.notices['enable-push-notifications'].dismissed = false;

    service.notices['update-tags'].shown = false;
    service.notices['update-tags'].position = 'inline';
    service.notices['update-tags'].completed = false;
    service.notices['update-tags'].dismissed = false;

    expect((service as any).getShowableNoticesByPosition('top')).toEqual([
      'verify-email',
      'build-your-algorithm',
    ]);

    expect((service as any).getShowableNoticesByPosition('inline')).toEqual([
      'update-tags',
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

  it('should call to service to check whether user has already verified their email', () => {
    (service as any).emailConfirmation.requiresEmailConfirmation.and.returnValue(
      false
    );
    expect((service as any).requiresEmailConfirmation()).toBeFalsy();
  });

  it('should call to service to check whether user has NOT already verified their email', () => {
    (service as any).emailConfirmation.requiresEmailConfirmation.and.returnValue(
      true
    );
    expect((service as any).requiresEmailConfirmation()).toBeTruthy();
  });

  it('should call to service to check whether user has NOT filled out compass answers', async () => {
    (service as any).compass.hasCompletedCompassAnswers.and.returnValue(false);
    expect(await (service as any).hasCompletedCompassAnswers()).toBeFalsy();
  });

  it('should call to service to check whether user has filled out compass answers', async () => {
    (service as any).compass.hasCompletedCompassAnswers.and.returnValue(true);
    expect(await (service as any).hasCompletedCompassAnswers()).toBeTruthy();
  });

  it('should call to service to check whether user has push notifications enabled', async () => {
    (service as any).notificationSettings.pushNotificationsEnabled$ = of(true);
    expect(await (service as any).hasPushNotificationsEnabled()).toBeTruthy();
  });

  it('should call to service to check whether user does NOT have push notifications enabled', async () => {
    (service as any).notificationSettings.pushNotificationsEnabled$ = of(false);
    expect(await (service as any).hasPushNotificationsEnabled()).toBeFalsy();
  });

  it('should get count of user set tags from service and determine a user needs to complete if they have set none', async () => {
    (service as any).tagsService.countTags.and.returnValue(0);
    expect(await (service as any).hasSetTags()).toBeFalsy();
  });

  it('should get count of user set tags from service and determine a user DOES NOT need to complete if they have set 1 or more', async () => {
    (service as any).tagsService.countTags.and.returnValue(1);
    expect(await (service as any).hasSetTags()).toBeTruthy();
  });

  it('should check whether a notice has already been dismissed', () => {
    const noticeName = 'build-your-algorithm';
    service.notices[noticeName].dismissed = false;
    (service as any).dismissService.isNoticeDismissed.and.returnValue(true);
    expect(
      (service as any).isNoticeDismissed('build-your-algorithm')
    ).toBeTruthy();
  });

  it('should determine whether a notice has NOT already been dismissed', () => {
    const noticeName = 'build-your-algorithm';
    service.notices[noticeName].dismissed = false;
    (service as any).dismissService.isNoticeDismissed.and.returnValue(false);
    expect(
      (service as any).isNoticeDismissed('build-your-algorithm')
    ).toBeFalsy();
  });

  it('should be aware of if experiment is active and notices should be full width', () => {
    (service as any).activityV2Experiment.isActive.and.returnValue(true);
    expect(service.shouldBeFullWidth()).toBeTruthy();

    (service as any).activityV2Experiment.isActive.and.returnValue(false);
    expect(service.shouldBeFullWidth()).toBeFalsy();
  });
});
