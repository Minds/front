import { storageMock } from '../../../../../tests/storage-mock.spec';
import { SettingsV2WalletService } from './wallet.service';

describe('SettingsV2WalletService', () => {
  let service: SettingsV2WalletService;

  beforeEach(() => {
    service = new SettingsV2WalletService(storageMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should set a new true value in local storage via the storage service', () => {
    spyOn((service as any).storage, 'set');
    service.setShouldHideWalletBalance(true);
    expect((service as any).storage.set).toHaveBeenCalledWith(
      'hide_wallet_balance',
      '1'
    );
  });

  it('should set a new false value in local storage via the storage service', () => {
    spyOn((service as any).storage, 'set');
    service.setShouldHideWalletBalance(false);
    expect((service as any).storage.set).toHaveBeenCalledWith(
      'hide_wallet_balance',
      '0'
    );
  });

  it('should return that wallet balance should be displayed if no storage item exists', () => {
    expect(service.shouldHideWalletBalance()).toBeFalse();
  });

  it('should return that wallet balance should be displayed if a storage value of 0, null or undefined is set', () => {
    spyOn((service as any).storage, 'get').and.returnValue('0');
    const shouldHideWalletBalance1 = service.shouldHideWalletBalance();
    expect((service as any).storage.get).toHaveBeenCalledWith(
      'hide_wallet_balance'
    );
    expect(shouldHideWalletBalance1).toBeFalse();

    (service as any).storage.get.and.returnValue(undefined);
    const shouldHideWalletBalance2 = service.shouldHideWalletBalance();
    expect((service as any).storage.get).toHaveBeenCalledWith(
      'hide_wallet_balance'
    );
    expect(shouldHideWalletBalance2).toBeFalse();

    (service as any).storage.get.and.returnValue(null);
    const shouldHideWalletBalance3 = service.shouldHideWalletBalance();
    expect((service as any).storage.get).toHaveBeenCalledWith(
      'hide_wallet_balance'
    );
    expect(shouldHideWalletBalance3).toBeFalse();

    expect((service as any).storage.get).toHaveBeenCalledTimes(3);
  });

  it('should return that wallet balance should NOT be displayed if a storage value of 1 is set', () => {
    spyOn((service as any).storage, 'get').and.returnValue('1');
    const shouldHideWalletBalance = service.shouldHideWalletBalance();
    expect(shouldHideWalletBalance).toBeTrue();
    expect((service as any).storage.get).toHaveBeenCalledOnceWith(
      'hide_wallet_balance'
    );
  });
});
