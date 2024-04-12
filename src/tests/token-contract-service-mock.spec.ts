export let tokenContractServiceMock = new (function () {
  this.increaseApproval = jasmine.createSpy('increaseApproval');
  this.balanceOf = jasmine.createSpy('balanceOf').and.callFake(async () => {
    return [500 * Math.pow(10, 18)];
  });
})();
