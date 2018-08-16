export let localWalletServiceMock = new function() {
  this.unlock = jasmine.createSpy('unlock');
  this.prune = jasmine.createSpy('prune');
};
