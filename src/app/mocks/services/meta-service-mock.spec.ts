export let metaServiceMock = new (function () {
  this.setCounter = jasmine.createSpy('setCounter').and.returnValue(this);
  this.setDescription = jasmine
    .createSpy('setDescription')
    .and.returnValue(this);
  this.setTitle = jasmine.createSpy('setTitle').and.returnValue(this);
  this.setOgImage = jasmine.createSpy('setOgImage').and.returnValue(this);
})();
