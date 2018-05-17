/**
 * Created by Nico on 14/05/2017.
 */
export let notificationServiceMock = new function () {
  this.clear = jasmine.createSpy('clear').and.stub();
  this.increment = jasmine.createSpy('increment').and.stub();
  this.getNotifications = jasmine.createSpy('getNotifications').and.stub();
  this.sync = jasmine.createSpy('sync').and.stub();
  this.listen = jasmine.createSpy('listen').and.stub();
};