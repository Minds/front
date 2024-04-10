export let loginReferrerServiceMock = new (function () {
  this.listen = jasmine.createSpy('listen');
  this.unlisten = jasmine.createSpy('unlisten');
  this.register = jasmine.createSpy('register');
  this.unregister = jasmine.createSpy('unregister');
  this.navigate = jasmine.createSpy('navigate');
  this.avoid = jasmine.createSpy('avoid');
  this.shouldBeAvoided = jasmine.createSpy('shouldBeAvoided');
})();
