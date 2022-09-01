import moment = require('moment');
import { FeedNoticeDismissalService } from './feed-notice-dismissal.service';

export let objectLocalStorageServiceMock = new (function() {
  this.setSingle = jasmine.createSpy('setSingle').and.returnValue(this);
  this.removeSingle = jasmine.createSpy('removeSingle').and.returnValue(this);
  this.getAll = jasmine.createSpy('getAll').and.returnValue(this);
})();

describe('FeedNoticeDismissalService', () => {
  let service: FeedNoticeDismissalService;

  beforeEach(() => {
    service = new FeedNoticeDismissalService(objectLocalStorageServiceMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should set dismiss state in notice', () => {
    service.dismissNotice('build-your-algorithm');
    expect((service as any).objectStorage.setSingle).toHaveBeenCalledWith(
      (service as any).storageKey,
      jasmine.any(Object)
    );
  });

  it('should determine if notice is dismissed', () => {
    (service as any).objectStorage.getAll.and.returnValue({
      'build-your-algorithm': {
        timestamp: moment().toDate(),
      },
    });
    expect(service.isNoticeDismissed('build-your-algorithm')).toBeTruthy();
  });

  it('should determine if notice is not dismissed', () => {
    (service as any).objectStorage.getAll.and.returnValue({
      'build-your-algorithm': {
        timestamp: moment().toDate(),
      },
    });
    expect(service.isNoticeDismissed('enable-push-notifications')).toBeFalsy();
  });

  it('should determine if notice dismissal is expired', () => {
    (service as any).objectStorage.getAll.and.returnValue({
      'build-your-algorithm': {
        timestamp: moment()
          .subtract(90, 'days')
          .toDate(),
      },
    });
    expect(service.isNoticeDismissed('build-your-algorithm')).toBeFalsy();
  });

  it('should determine notice is not dismissed if nothing in object storage', () => {
    (service as any).objectStorage.getAll.and.returnValue({});
    expect(service.isNoticeDismissed('enable-push-notifications')).toBeFalsy();
  });

  it('should call to remove a single notice from object storage', () => {
    const key = 'enable-push-notifications';
    service.undismissNotice(key);
    expect((service as any).objectStorage.removeSingle).toHaveBeenCalledWith(
      'dismissed-feed-notices',
      key
    );
  });
});
