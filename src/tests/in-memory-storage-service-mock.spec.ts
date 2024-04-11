export const inMemoryStorageServiceMock = new (function () {
  this.get = jasmine.createSpy('get');
  this.set = jasmine.createSpy('set');
  this.destroy = jasmine.createSpy('destroy');
  this.once = jasmine.createSpy('once');
})();
