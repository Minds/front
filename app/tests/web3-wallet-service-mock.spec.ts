// TODO actually implement these mocks when necessary for testing

export let web3WalletServiceMock = new function () {
  this.response = '0x1234567890ONCHAIN123456789';

  this.getCurrentWallet = jasmine.createSpy('getCurrentWallet').and.callFake(async () => {
    return this.response;
  });
};
