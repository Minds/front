export let boostContractServiceMock = new function () {
  this.instance = null;
  this.tx = '';
  this.load = jasmine.createSpy('load');
  this.boost = jasmine.createSpy('boost').and.callFake(async () => this.instance);
  this.create = jasmine.createSpy('create').and.callFake(async () => this.tx);
  this.createPeer = jasmine.createSpy('createPeer').and.callFake(async () => this.tx);
  this.accept = jasmine.createSpy('accept').and.callFake(async () => this.tx);
  this.reject = jasmine.createSpy('reject').and.callFake(async () => this.tx);
  this.revoke = jasmine.createSpy('revoke').and.callFake(async () => this.tx);
};
