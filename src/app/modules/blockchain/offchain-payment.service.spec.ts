import { OffchainPaymentService } from './offchain-payment.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { fakeAsync } from '@angular/core/testing';

describe('OffchainPaymentService', () => {

  let service: OffchainPaymentService;

  beforeEach(() => {
    service = new OffchainPaymentService(clientMock);
    clientMock.response = {};
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should create an offchain transaction', fakeAsync(async () => {
    const url = `api/v1/blockchain/transactions/spend`;
    clientMock.response[url] = {
      txHash: '0x1234'
    };

    let txHash = await service.create('boost', 10 ** 18);
    jasmine.clock().tick(10);

    expect(clientMock.post).toHaveBeenCalled();
    const args = clientMock.post.calls.mostRecent().args;
    expect(args[0]).toBe(url);
    expect(args[1]).toEqual({type: 'boost', amount: 10 ** 18});

    expect(txHash).toBe('0x1234');
  }));

});
