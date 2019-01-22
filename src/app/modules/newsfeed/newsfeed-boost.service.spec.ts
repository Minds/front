import { NewsfeedBoostService } from './newsfeed-boost.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { sessionMock } from '../../../tests/session-mock.spec';
import { fakeAsync } from '@angular/core/testing';

describe('NewsfeedBoostService', () => {

  let service: NewsfeedBoostService;

  beforeEach(() => {
    service = new NewsfeedBoostService(sessionMock, clientMock);
    clientMock.response = {};

    sessionMock.user.boost_autorotate = true;
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should disable boosts by default if user is plus and has boosts disabled', () => {
    sessionMock.user.plus = true;
    sessionMock.user.disabled_boost = true;
    service = new NewsfeedBoostService(sessionMock, clientMock);

    expect(service.enabled).toBeFalsy();
  });

  it('should disable boosts autorotate if user has that option disabled', () => {
    sessionMock.user.boost_autorotate = false;
    service = new NewsfeedBoostService(sessionMock, clientMock);

    expect(service.paused).toBeTruthy();
  });

  it("should set the user's explicit rating", fakeAsync(() => {
    sessionMock.user.mature = false;

    const url = 'api/v1/settings/1000';

    clientMock.response[url] = { 'status': 'success' };

    service.setExplicit(true);

    jasmine.clock().tick(10);

    expect(sessionMock.user.mature).toBeTruthy();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      mature: true,
      boost_rating: 2
    });
  }));

  it('should toggle boost pause', fakeAsync(() => {
    expect(service.isBoostPaused()).toBeFalsy();

    const url = 'api/v1/settings';

    clientMock.post[url] = { 'status': 'success' };

    service.togglePause();

    jasmine.clock().tick(10);

    expect(service.isBoostPaused).toBeTruthy();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ boost_autorotate: !service.isBoostPaused() });
  }));

  it('should hide boosts', fakeAsync(()=> {
    sessionMock.user.disabled_boost = false;

    const url = 'api/v1/plus/boost';
    clientMock.response[url] = { 'status': 'success'};

    service.hideBoost();

    jasmine.clock().tick(10);

    expect(sessionMock.user.disabled_boost).toBeTruthy();
    expect(service.enabled).toBeFalsy();

    expect(clientMock.put).toHaveBeenCalled();
    expect(clientMock.put.calls.mostRecent().args[0]).toBe(url);
  }));

  it('should show boosts', fakeAsync(()=> {
    expect(sessionMock.user.disabled_boost).toBeTruthy();

    const url = 'api/v1/plus/boost';
    clientMock.response[url] = { 'status': 'success'};

    service.showBoost();

    jasmine.clock().tick(10);

    expect(sessionMock.user.disabled_boost).toBeFalsy();
    expect(service.enabled).toBeTruthy();

    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
  }));
});
