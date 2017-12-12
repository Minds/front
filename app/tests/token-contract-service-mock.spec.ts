export let tokenContractServiceMock = new function () {
  this.increaseApproval = jasmine.createSpy('increaseApproval');
};
