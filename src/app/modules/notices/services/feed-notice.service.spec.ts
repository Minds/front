import { BehaviorSubject, of } from 'rxjs';
import { FeedNotice, NoticeKey } from '../feed-notice.types';
import { FeedNoticeService } from './feed-notice.service';

const defaultNotices = [
  {
    key: 'verify-email',
    location: 'top',
    should_show: true,
    dismissed: false,
    position: null,
  },
  {
    key: 'build-your-algorithm',
    location: 'inline',
    should_show: true,
    dismissed: false,
    position: null,
  },
  {
    key: 'update-tags',
    location: 'inline',
    should_show: true,
    dismissed: false,
    position: null,
  },
  {
    key: 'enable-push-notifications',
    location: 'inline',
    should_show: true,
    dismissed: false,
    position: null,
  },
];

export let feedNoticeDismissalService = new (function() {
  this.dismissNotice = jasmine.createSpy('dismissNotice').and.returnValue(this);
  this.undismissNotice = jasmine
    .createSpy('undismissNotice')
    .and.returnValue(this);
  this.isNoticeDismissed = jasmine
    .createSpy('isNoticeDismissed')
    .and.returnValue(false);
})();

export let activityV2ExperimentServiceMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

export let sessionMock = new (function() {
  this.loggedinEmitter = new BehaviorSubject<boolean>(false);
})();

export let apiServiceMock = new (function() {
  this.get = jasmine.createSpy('get').and.returnValue(
    of({
      status: 'success',
      notices: [
        {
          key: 'verify-email',
          location: 'top',
          should_show: true,
        },
        {
          key: 'build-your-algorithm',
          location: 'inline',
          should_show: true,
        },
        {
          key: 'update-tags',
          location: 'inline',
          should_show: true,
        },
        {
          key: 'enable-push-notifications',
          location: 'inline',
          should_show: true,
        },
      ],
    })
  );
})();

describe('FeedNoticeService', () => {
  let service: FeedNoticeService;

  beforeEach(() => {
    service = new FeedNoticeService(
      apiServiceMock,
      activityV2ExperimentServiceMock,
      feedNoticeDismissalService,
      sessionMock
    );
    (service as any).notices$.next(defaultNotices);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
    expect((service as any).api.get).toHaveBeenCalledWith(
      'api/v3/feed-notices'
    );
    expect((service as any).initialized$.getValue()).toBeTruthy();
    expect((service as any).notices$.getValue()).toEqual(defaultNotices);
  });

  it('should register an outlet for top location', () => {
    const returnedPosition = service.register('top');

    expect(returnedPosition).toBe(-1);

    let updatedNotices = defaultNotices;
    updatedNotices[0].position = -1;

    expect((service as any).notices$.getValue()).toEqual(updatedNotices);
  });

  it('should register an outlet for inline location', () => {
    const returnedPosition = service.register('inline');
    expect(returnedPosition).toBe(1);

    let updatedNotices = defaultNotices;
    for (let notice of updatedNotices) {
      if (notice.location === 'inline') {
        notice.position = 1;
      }
    }

    expect((service as any).notices$.getValue()).toEqual(updatedNotices);
  });

  it('should unregister an outlet by position', () => {
    let updatedNotices = defaultNotices;
    for (let notice of updatedNotices) {
      if (notice.location === 'build-your-algorithm') {
        notice.position = 1;
      }
    }
    (service as any).notices$.next(updatedNotices);
    expect((service as any).notices$.getValue()).toEqual(updatedNotices);

    service.unregister('build-your-algorithm');
    expect((service as any).notices$.getValue()).toEqual(defaultNotices);
  });

  it('should dismiss', () => {
    let updatedNotices = defaultNotices;
    for (let notice of updatedNotices) {
      if (notice.location === 'build-your-algorithm') {
        notice.dismissed = true;
      }
    }

    service.dismiss('build-your-algorithm');

    expect((service as any).notices$.getValue()).toEqual(updatedNotices);
  });

  it('should undismiss', () => {
    let noticeKey: NoticeKey = 'build-your-algorithm',
      updatedNotices = defaultNotices;

    for (let notice of updatedNotices) {
      if (notice.location === noticeKey) {
        notice.dismissed = false;
      }
    }

    service.undismiss(noticeKey);

    expect((service as any).notices$.getValue()).toEqual(updatedNotices);
    expect(
      (service as any).dismissalService.undismissNotice
    ).toHaveBeenCalledWith(noticeKey);
  });

  it('should be aware of if experiment is active and notices should be full width', () => {
    (service as any).activityV2Experiment.isActive.and.returnValue(true);
    expect(service.shouldBeFullWidth()).toBeTruthy();

    (service as any).activityV2Experiment.isActive.and.returnValue(false);
    expect(service.shouldBeFullWidth()).toBeFalsy();
  });

  it('should determine whether notice should be sticky top', () => {
    (service as any).activityV2Experiment.isActive.and.returnValue(true);
    expect(
      service.shouldBeStickyTop({ key: 'verify-email' } as FeedNotice)
    ).toBeTruthy();

    (service as any).activityV2Experiment.isActive.and.returnValue(false);
    expect(
      service.shouldBeStickyTop({ key: 'verify-email' } as FeedNotice)
    ).toBeFalsy();

    (service as any).activityV2Experiment.isActive.and.returnValue(true);
    expect(
      service.shouldBeStickyTop({ key: 'build-your-algorithm' } as FeedNotice)
    ).toBeFalsy();
  });
});
