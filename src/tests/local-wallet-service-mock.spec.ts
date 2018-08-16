export let localWalletServiceMock = new function() {
  this.unlock = jasmine.createSpy('unlock');
  this.prune = jasmine.createSpy('prune');

  this.create = jasmine.createSpy('create').and.returnValue('0xadress');
};
