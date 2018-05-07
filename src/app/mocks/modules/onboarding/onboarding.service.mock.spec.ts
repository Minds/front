export let onboardingServiceMock = new function () {
  this.enable = jasmine.createSpy('enable');
  this.shouldShow = jasmine.createSpy('shouldShow');
  this.hide = jasmine.createSpy('hide');
  this.show = jasmine.createSpy('show');
};