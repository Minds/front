export let analyticsServiceMock = new (function() {
  this.send = jasmine.createSpy('send').and.stub();
  this.onRouterInit = jasmine.createSpy('onRouterInit').and.stub();
  this.onRouteChanged = jasmine.createSpy('onRouteChanged').and.stub();
  this.preventDefault = jasmine.createSpy('preventDefault').and.stub();
  this.wasDefaultPrevented = jasmine
    .createSpy('wasDefaultPrevented')
    .and.stub();
})();
