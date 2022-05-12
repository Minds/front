import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { sessionMock } from '../../../tests/session-mock.spec';
import { MockService } from '../../utils/mock';
import { clientMock } from './../../../tests/client-mock.spec';
import { entitiesServiceMock } from './../../../tests/entities-service-mock.spec';
import { recentServiceMock } from './../../../tests/minds-recent-service-mock.spec';
import { storageMock } from './../../../tests/storage-mock.spec';
import { ApiService } from './../api/api.service';
import { BlockListService } from './block-list.service';
import { FeedsService, NEW_POST_POLL_INTERVAL } from './feeds.service';

describe('FeedsService', () => {
  let service: FeedsService;

  let apiMock;

  beforeEach(() => {
    apiMock = MockService(ApiService, {
      get() {
        return new BehaviorSubject<any>({ status: 'success', count: 2 });
      },
    });
    service = new FeedsService(
      clientMock,
      apiMock,
      sessionMock,
      entitiesServiceMock,
      BlockListService._(
        clientMock,
        sessionMock,
        storageMock,
        recentServiceMock
      )
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should poll correctly and update count', fakeAsync(() => {
    spyOn(document, 'hasFocus').and.returnValue(true);
    spyOn(service, 'count').and.returnValue(of(1));
    service.newPostsLastCheckedAt = 2;

    service.watchForNewPosts();
    tick(NEW_POST_POLL_INTERVAL * 3); // three polls
    expect(document.hasFocus).toHaveBeenCalled();
    expect(service.count).toHaveBeenCalledWith(2);
    expect(service.count).toHaveBeenCalledTimes(3);
    expect(service.newPostsCount$.getValue()).toEqual(3);

    discardPeriodicTasks();
  }));

  it("should not count if window isn't active", fakeAsync(() => {
    spyOn(document, 'hasFocus').and.returnValue(false);
    spyOn(service, 'count').and.returnValue(of(1));

    service.watchForNewPosts();
    tick(NEW_POST_POLL_INTERVAL);
    expect(document.hasFocus).toHaveBeenCalled();
    expect(service.count).not.toHaveBeenCalled();

    discardPeriodicTasks();
  }));

  it('should count right', async () => {
    const fakeNow = 1651150130962;
    spyOn(Date, 'now').and.returnValue(fakeNow);
    service.setCountEndpoint('fakeEndpoint');
    const count = service.count();
    expect(await count.pipe(take(1)).toPromise()).toEqual(2);
    expect(apiMock.get).toHaveBeenCalledWith(
      'fakeEndpoint',
      jasmine.objectContaining({
        from_timestamp: fakeNow,
      })
    );
  });

  it('should deny if no countEndpoint was given', () => {
    expect(service.count).toThrow();
    expect(apiMock.get).not.toHaveBeenCalled();
  });
});
