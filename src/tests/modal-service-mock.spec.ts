// TODO actually implement these mocks when necessary for testing

export let modalServiceMock = new (function () {
  this.present = jasmine.createSpy('present').and.returnValue({
    result: new Promise(() => {}),
  });
  this.dismissAll = jasmine.createSpy('dismissAll').and.stub();
  this.dismiss = jasmine.createSpy('dismiss').and.stub();
  this.canOpenInModal = jasmine.createSpy('canOpenInModal').and.stub();
})();
