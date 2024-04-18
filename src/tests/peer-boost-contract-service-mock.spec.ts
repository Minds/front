export let peerBoostContractServiceMock = new (function () {
  this.create = jasmine.createSpy('create').and.returnValue('hash');
})();
