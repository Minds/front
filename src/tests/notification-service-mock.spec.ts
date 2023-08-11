/**
 * Created by Nico on 14/05/2017.
 */
export let notificationServiceMock = new (function() {
  this.clearCount = jasmine.createSpy('clearCount').and.stub();
  this.incrementCount = jasmine.createSpy('incrementCount').and.stub();
  this.updateNotificationCount = jasmine
    .createSpy('updateNotificationCount')
    .and.stub();
  this.syncCount = jasmine.createSpy('syncCount').and.stub();
  this.listen = jasmine.createSpy('listen').and.stub();
  this.unlisten = jasmine.createSpy('unlisten').and.stub();
})();
