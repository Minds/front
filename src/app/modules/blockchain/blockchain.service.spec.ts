import { BlockchainService } from './blockchain.service';
import { fakeAsync } from '@angular/core/testing';
import { clientMock } from '../../../tests/client-mock.spec';
import { sessionMock } from '../../../tests/session-mock.spec';

describe('BlockchainService', () => {
  let service: BlockchainService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new BlockchainService(clientMock, sessionMock);
    clientMock.response = {};
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should get the wallet', fakeAsync(() => {
    const url = 'api/v2/blockchain/wallet/address';

    clientMock.response[url] = {
      status: 'success',
      wallet: '0x1234',
    };

    service.getWallet();
    jasmine.clock().tick(10);

    expect(clientMock.get).toHaveBeenCalled();
    const args = clientMock.get.calls.mostRecent().args;
    expect(args[0]).toBe(url);
  }));

  it('should set the wallet', fakeAsync(() => {
    const url = 'api/v2/blockchain/wallet';

    clientMock.response[url] = {
      status: 'success',
    };

    service.setWallet({ address: '0x1234' });
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      address: '0x1234',
    });
  }));

  it('should get the balance', fakeAsync(async () => {
    const url = 'api/v2/blockchain/wallet/balance';
    clientMock.response[url] = { status: 'success', balance: 10 ** 18 };

    let balance = await service.getBalance();
    jasmine.clock().tick(10);
    expect(clientMock.post).toHaveBeenCalled();
    expect(balance).toBe(10 ** 18);
  }));
});
