export const newsfeedHashtagSelectorServiceMock = new (function () {
  this.subscribe = jasmine.createSpy('subscribe');
  this.emit = jasmine.createSpy('emit');
})();
