export let configMock = new (function() {
  this.get = jasmine.createSpy('get');
  this.set = jasmine.createSpy('set');
  this.loadFromRemote = jasmine.createSpy('loadFromRemote');
})();
