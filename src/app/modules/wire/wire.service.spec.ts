import { WireService } from './wire.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { wireContractServiceMock } from '../../../tests/wire-contract-service-mock.spec';
import { tokenContractServiceMock } from '../../../tests/token-contract-service-mock.spec';
import { web3WalletServiceMock } from '../../../tests/web3-wallet-service-mock.spec';
import { fakeAsync, tick } from '@angular/core/testing';
import { BTCService } from '../payments/btc/btc.service';

describe('WireService', () => {
  let service: WireService;
  const wireGuid = null;
  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new WireService(
      clientMock,
      wireContractServiceMock,
      tokenContractServiceMock,
      web3WalletServiceMock,
      new (() => {})()
    );

    clientMock.response = {};

    clientMock.response[`api/v1/wire/${wireGuid}`] = { status: 'success' };

    clientMock.get.calls.reset();
    clientMock.post.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should submit an onchain wire', fakeAsync(() => {
    service.submitWire({
      amount: 10,
      guid: null,
      payload: { receiver: '0x1234', address: '' },
      payloadType: 'onchain',
      recurring: false,
      recurringInterval: 'once',
    });

    tick();

    expect(web3WalletServiceMock.ready).toHaveBeenCalled();
    expect(web3WalletServiceMock.isUnavailable).toHaveBeenCalled();
    expect(web3WalletServiceMock.getCurrentWallet).toHaveBeenCalled();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(`api/v2/wire/null`);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      amount: 10,
      payload: {
        receiver: '0x1234',
        address: '0x123',
        method: 'onchain',
        txHash: 'hash',
      },
      method: 'onchain',
      recurring: false,
      recurring_interval: 'once',
    });
  }));

  it('should submit an offchain wire', fakeAsync(() => {
    service.submitWire({
      amount: 10,
      guid: null,
      payload: null,
      payloadType: 'offchain',
      recurring: false,
      recurringInterval: 'once',
    });

    tick();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(`api/v2/wire/null`);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      amount: 10,
      payload: { address: 'offchain', method: 'offchain' },
      method: 'offchain',
      recurring: false,
      recurring_interval: 'once',
    });
  }));

  it('should submit a usd wire', fakeAsync(() => {
    service.submitWire({
      amount: 10,
      guid: null,
      payload: { address: 'offchain', token: 'tok_KPte7942xySKBKyrBu11yEpf' },
      payloadType: 'usd',
      recurring: false,
      recurringInterval: 'once',
    });

    tick();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(`api/v2/wire/null`);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      amount: 10,
      payload: {
        address: 'offchain',
        token: 'tok_KPte7942xySKBKyrBu11yEpf',
        method: 'usd',
      },
      method: 'usd',
      recurring: false,
      recurring_interval: 'once',
    });
  }));
});
