export let tokenContractServiceMock = new function () {
  this.increaseApproval = jasmine.createSpy('increaseApproval');
  this.balanceOf = jasmine.createSpy('balanceOf').and.callFake(async () => {
    return ['10000000000000000000']
  });
};
