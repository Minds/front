// TODO actually implement these mocks when necessary for testing

export let web3WalletServiceMock = new (function() {
  this.wallets = ['0x123', '0x1234'];
  this.balance = 127000000000000000000;
  this.onChainInterfaceLabel = 'Metamask';
  this.unavailable = false;
  this.locked = false;
  this.isLocalWallet = false;
  this.deviceIsSupported = true;

  this.isUnavailable = jasmine.createSpy('isUnavailable').and.callFake(() => {
    return this.unavailable;
  });

  this.unlock = jasmine.createSpy('unlock').and.callFake(async () => {
    return !this.locked;
  });

  this.ready = jasmine.createSpy('ready').and.callFake(async () => {
    return true;
  });

  this.getWallets = jasmine.createSpy('getWallets').and.callFake(async () => {
    return this.wallets;
  });
  this.getCurrentWallet = jasmine
    .createSpy('getCurrentWallet')
    .and.callFake(async () => {
      return this.wallets[0];
    });
  this.getBalance = jasmine.createSpy('getBalance').and.callFake(async () => {
    return this.balance;
  });

  this.isLocal = jasmine.createSpy('isLocal').and.callFake(async () => {
    return this.isLocalWallet;
  });

  this.checkDeviceIsSupported = jasmine
    .createSpy('checkDeviceIsSupported')
    .and.callFake(() => {
      return this.deviceIsSupported;
    });

  this.getOnChainInterfaceLabel = jasmine
    .createSpy('getOnChainInterfaceLabel')
    .and.callFake(() => {
      return this.onChainInterfaceLabel
        ? this.onChainInterfaceLabel
        : 'Metamask';
    });
})();
