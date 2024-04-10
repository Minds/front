export let wireContractServiceMock = new (function () {
  this.create = jasmine.createSpy('create').and.returnValue('hash');
})();
