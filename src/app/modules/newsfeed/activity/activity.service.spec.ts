import { BehaviorSubject } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';
import { ActivityService } from './activity.service';
import { AccessId } from '../../../common/enums/access-id.enum';
import { MockService } from '../../../utils/mock';
import { ApiService } from '../../../common/api/api.service';

describe('ActivityService', () => {
  let service: ActivityService;

  let configsMock = new (function () {
    this.get = jasmine.createSpy('get');
  })();

  let sessionsMock = new (function () {
    this.user$ = new BehaviorSubject<number>(userMock);
    this.isLoggedIn = jasmine.createSpy('isLoggedIn');
    this.getLoggedInUser = jasmine.createSpy('getLoggedInUser');
  })();

  let entityMetricsSocketMock = new (function () {
    this.listen = jasmine.createSpy('listen');
    this.leave = jasmine.createSpy('leave');
    this.thumbsUpCount$ = new BehaviorSubject<number>(0);
    this.thumbsDownCount$ = new BehaviorSubject<number>(0);
  })();

  let apiMock, toastMock;

  beforeEach(() => {
    apiMock = MockService(ApiService, {
      get() {
        return new BehaviorSubject<any>({
          status: 'success',
          'has-reminded': true,
        });
      },
      delete() {
        return new BehaviorSubject<any>({ status: 'success' });
      },
    });

    toastMock = new (function () {
      this.error = jasmine.createSpy('error');
    })();

    service = new ActivityService(
      configsMock,
      sessionsMock,
      apiMock,
      toastMock,
      entityMetricsSocketMock
    );

    (service as any).session.isLoggedIn.calls.reset();
    (service as any).session.getLoggedInUser.calls.reset();

    service.entity$.next({
      guid: '123',
      entity_guid: '321',
    });
  });

  afterEach(() => {
    if ((service as any).thumbsUpMetricSubscription) {
      (service as any).thumbsUpMetricSubscription.unsubscribe();
    }
    if ((service as any).thumbsDownMetricSubscription) {
      (service as any).thumbsDownMetricSubscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup metrics socket listener when service is present with entity guid', () => {
    service.entity$.next({ guid: '123', entity_guid: '321' });

    service.setupMetricsSocketListener();

    (service as any).entityMetricsSocket.thumbsUpCount$.next(5);

    expect((service as any).entityMetricsSocket.listen).toHaveBeenCalledWith(
      '321'
    );

    service.entity$
      .subscribe((entity) => {
        expect(entity['thumbs:up:count']).toBe(5);
      })
      .unsubscribe();
  });

  it('should setup metrics socket listener when service is present with guid if no entity guid is present', () => {
    service.entity$.next({ guid: '123' });
    service.setupMetricsSocketListener();

    (service as any).entityMetricsSocket.thumbsUpCount$.next(2);

    expect((service as any).entityMetricsSocket.listen).toHaveBeenCalledWith(
      '123'
    );

    service.entity$
      .subscribe((entity) => {
        expect(entity['thumbs:up:count']).toBe(2);
      })
      .unsubscribe();
  });

  it('should teardown subscriptions to metric sockets with entity_guid', () => {
    service.entity$.next({ guid: '123', entity_guid: '321' });
    service.setupMetricsSocketListener();

    service.teardownMetricsSocketListener();
    expect((service as any).entityMetricsSocket.leave).toHaveBeenCalledWith(
      '321'
    );
  });

  it('should teardown subscriptions to metric sockets with guid if no entity_guid is present', () => {
    service.entity$.next({ guid: '123' });
    service.setupMetricsSocketListener();

    service.teardownMetricsSocketListener();
    expect((service as any).entityMetricsSocket.leave).toHaveBeenCalledWith(
      '123'
    );
  });

  it('should determine if nsfw consent overlay should be NOT be shown because content is not NSFW', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [],
      ownerObj: {
        nsfw: [],
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeFalse();
      done();
    });
  });

  it('should determine if nsfw consent overlay should be NOT be shown because content and remind are not NSFW', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [],
      ownerObj: {
        nsfw: [],
      },
      remind_object: {
        nsfw: [],
        ownerObj: {
          nsfw: [],
        },
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeFalse();
      done();
    });
  });

  it('should determine if nsfw consent overlay should be shown because content is nsfw', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [1],
      ownerObj: {
        nsfw: [],
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeTrue();
      done();
    });
  });

  it('should determine if nsfw consent overlay should be shown because its a remind of nsfw content', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [],
      ownerObj: {
        nsfw: [],
      },
      remind_object: {
        nsfw: [1],
        ownerObj: {
          nsfw: [],
        },
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeTrue();
      done();
    });
  });

  it('should determine if nsfw consent overlay should be shown because its a remind of an nsfw owners content', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [],
      ownerObj: {
        nsfw: [],
      },
      remind_object: {
        nsfw: [],
        ownerObj: {
          nsfw: [1],
        },
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeTrue();
      done();
    });
  });

  it('should determine if nsfw consent overlay should be shown because owner is nsfw', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [],
      ownerObj: {
        nsfw: [1],
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeTrue();
      done();
    });
  });

  it('should determine if nsfw consent overlay should NOT be shown because user is consented', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [1],
      ownerObj: {
        nsfw: [1],
      },
      remind_object: {
        ownerObj: {
          nsfw: [],
        },
      },
    });

    service.isNsfwConsented$.next(true);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: false });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeFalse();
      done();
    });
  });

  it('should determine if nsfw consent overlay should NOT be shown because user has mature flag', (done: DoneFn) => {
    service.entity$.next({
      nsfw: [1],
      ownerObj: {
        nsfw: [1],
      },
    });

    service.isNsfwConsented$.next(false);

    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).session.getLoggedInUser.and.returnValue({ mature: true });

    service.shouldShowNsfwConsent$.subscribe((shouldShowNsfwConsent) => {
      expect(shouldShowNsfwConsent).toBeFalse();
      done();
    });
  });

  describe('displayOptions', () => {
    it('should have correctly defaulted displayOptions', () => {
      expect((service as any).displayOptions).toEqual({
        autoplayVideo: true,
        showOwnerBlock: true,
        showComments: true,
        showOnlyCommentsInput: true,
        showOnlyCommentsToggle: false,
        showToolbar: true,
        showToolbarButtonsRow: true,
        showExplicitVoteButtons: false,
        showInteractions: false,
        canShowLargeCta: false,
        showEditedTag: false,
        showVisibilityState: false,
        showTranslation: false,
        showPostMenu: true,
        showPinnedBadge: true,
        showMetrics: true,
        isModal: false,
        minimalMode: false,
        bypassMediaModal: false,
        sidebarMode: false,
        boostRotatorMode: false,
        isSidebarBoost: false,
        isFeed: false,
        isSingle: false,
        permalinkBelowContent: false,
        hasLoadingPriority: false,
        inSingleGroupFeed: false,
        isComposerPreview: false,
        hideTopBorder: false,
      });
    });
  });

  describe('isPrivate$', () => {
    it('should return that entity is private if it is private', (done: DoneFn) => {
      service.entity$.next({
        access_id: AccessId.Private,
      });

      service.isPrivate$.subscribe((isPrivate: boolean) => {
        expect(isPrivate).toBe(true);
        done();
      });
    });

    it('should return that entity is NOT private if it is logged-in only', (done: DoneFn) => {
      service.entity$.next({
        access_id: AccessId.LoggedIn,
      });

      service.isPrivate$.subscribe((isPrivate: boolean) => {
        expect(isPrivate).toBe(false);
        done();
      });
    });

    it('should return that entity is NOT private if it is public', (done: DoneFn) => {
      service.entity$.next({
        access_id: AccessId.Public,
      });

      service.isPrivate$.subscribe((isPrivate: boolean) => {
        expect(isPrivate).toBe(false);
        done();
      });
    });
  });
});
