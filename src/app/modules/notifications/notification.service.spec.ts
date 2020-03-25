import { NotificationService } from './notification.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { sessionMock } from '../../../tests/session-mock.spec';
import { socketMock } from '../../../tests/socket-mock.spec';
import { fakeAsync, tick } from '@angular/core/testing';
import { SiteService } from '../../common/services/site.service';
import { EventEmitter, PLATFORM_ID } from '@angular/core';

export let siteServiceMock = new (function() {
  var pro = () => null;
  var isProDomain = () => false;
  var title = () => 'Minds';
  var isAdmin = () => true;
})();
export let metaServiceMock = new (function() {
  this.setCounter = jasmine.createSpy('setCounter').and.returnValue(this);
  this.setDescription = jasmine
    .createSpy('setDescription')
    .and.returnValue(this);
  this.setTitle = jasmine.createSpy('setTitle').and.returnValue(this);
  this.setOgImage = jasmine.createSpy('setOgImage').and.returnValue(this);
})();

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new NotificationService(
      sessionMock,
      clientMock,
      socketMock,
      metaServiceMock,
      PLATFORM_ID,
      siteServiceMock
    );
    clientMock.response = {};
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe when listening', fakeAsync(() => {
    const entity: any = {
      guid: 123,
    };

    service.listen();
    jasmine.clock().tick(10);
    expect(socketMock.subscribe).toHaveBeenCalled();
    service.increment(4);

    expect(service.count).toBe(4);
  }));
});
