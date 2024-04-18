export let mindsTitleMock = new (function () {
  this.setTitle = jasmine.createSpy('setTitle');
  this.setCounter = jasmine.createSpy('setCounter');
  this.applyTitle = jasmine.createSpy('applyTitle');
})();
