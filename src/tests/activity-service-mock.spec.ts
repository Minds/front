export let activityServiceMock = new (function() {
  this.toggleAllowComments = jasmine
    .createSpy('toggleAllowComponents')
    .and.stub();
})();
