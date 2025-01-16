import { WireService } from './wire.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { wireContractServiceMock } from '../../../tests/wire-contract-service-mock.spec';
import { tokenContractServiceMock } from '../../../tests/token-contract-service-mock.spec';
import { web3WalletServiceMock } from '../../../tests/web3-wallet-service-mock.spec';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

let restrictedAddressMock = new (function () {
  this.isRestricted = jasmine.createSpy('isRestricted');
})();

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
      restrictedAddressMock,
      null,
      null
    );

    clientMock.response = {};

    clientMock.response[`api/v1/wire/${wireGuid}`] = { status: 'success' };

    clientMock.get.calls.reset();
    clientMock.post.calls.reset();
  });

  afterEach(() => {
    (service as any).restrictedAddress.isRestricted.and.returnValue(of(false));
    jasmine.clock().uninstall();
  });

  xit('should submit an onchain wire', fakeAsync(() => {
    (service as any).restrictedAddress.isRestricted.and.returnValue(of(false));

    service.submitWire({
      amount: 10,
      guid: null,
      payload: { receiver: '0x1234', address: '' },
      payloadType: 'onchain',
      recurring: false,
      recurringInterval: 'once',
      sourceEntityGuid: null,
    });

    tick();

    expect(web3WalletServiceMock.isUnavailable).toHaveBeenCalled();
    expect(web3WalletServiceMock.getCurrentWallet).toHaveBeenCalled();
    expect(restrictedAddressMock.isRestricted).toHaveBeenCalled();

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
      source_entity_guid: null,
    });
  }));

  it('should NOT submit an onchain wire if address is restricted', async () => {
    (service as any).restrictedAddress.isRestricted.and.returnValue(of(true));
    spyOn(console, 'error');

    try {
      await service.submitWire({
        amount: 10,
        guid: null,
        payload: { receiver: '0x1234', address: '' },
        payloadType: 'onchain',
        recurring: false,
        recurringInterval: 'once',
      });
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith(
        '[Wire/Token]',
        new Error('Your address is restricted')
      );
    }

    expect(web3WalletServiceMock.isUnavailable).toHaveBeenCalled();
    expect(web3WalletServiceMock.getCurrentWallet).toHaveBeenCalled();
    expect(restrictedAddressMock.isRestricted).toHaveBeenCalled();

    expect(clientMock.post).not.toHaveBeenCalled();
  });

  it('should submit an offchain wire', fakeAsync(() => {
    service.submitWire({
      amount: 10,
      guid: null,
      payload: null,
      payloadType: 'offchain',
      recurring: false,
      recurringInterval: 'once',
      sourceEntityGuid: null,
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
      source_entity_guid: null,
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
      sourceEntityGuid: null,
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
      source_entity_guid: null,
    });
  }));
});
