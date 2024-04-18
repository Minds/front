export const entitiesServiceMock = new (function () {
  this.single = jasmine.createSpy('single').and.callFake(function () {
    return {};
  });
})();
