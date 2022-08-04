import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { web3WalletServiceMock } from '../../../../tests/web3-wallet-service-mock.spec';

import { BoostModalService } from './boost-modal.service';

export let toasterServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

export let boostContractServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

export let apiServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
  this.get = jasmine.createSpy('success').and.returnValue(new Observable(null));
})();

xdescribe('BoostModalService', () => {
  let service: BoostModalService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    service = new BoostModalService(
      apiServiceMock,
      toasterServiceMock,
      web3WalletServiceMock,
      boostContractServiceMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should call to fetch balance', () => {
    service.fetchBalance().subscribe(val => {
      expect(apiServiceMock.get).toHaveBeenCalledWith(
        'api/v2/blockchain/wallet/balance'
      );
    });
  });

  it('should call to prepare boost payload', () => {
    service.entity$.next({ guid: '123' });

    (service as any).prepareBoostPayload().subscribe(val => {
      expect(apiServiceMock.get).toHaveBeenCalledWith(
        'api/v2/boost/prepare/123'
      );
    });
  });

  it('should call to post boost activity', () => {
    service.entity$.next({ guid: '123', type: 'newsfeed', owner_guid: '123' });

    const mockPayload = {
      bidType: 'tokens',
      checksum: '0x00',
      guid: '321',
      impressions: 1000,
      paymentMethod: 'offchain',
    };

    (service as any).postBoostActivity(mockPayload).subscribe(val => {
      expect(apiServiceMock.get).toHaveBeenCalledWith(
        'api/v2/boost/newsfeed/321/123'
      );
    });
  });

  it('should call to post peer boost', () => {
    service.entity$.next({ guid: '123', type: 'newsfeed', owner_guid: '321' });

    const mockPayload = {
      bid: 1000,
      checksum: '0x00',
      currency: 'tokens',
      destination: '1234',
      guid: '4321',
      paymentMethod: 'tokens',
    };

    (service as any).postPeerBoost(mockPayload).subscribe(val => {
      expect(apiServiceMock.get).toHaveBeenCalledWith(
        'api/v2/boost/peer/123/321'
      );
    });
  });

  it('should correctly assemble direct boost payload', () => {
    const preparedRepsonseMock = {
      status: 'success',
      guid: '123',
      checksum: '0x00',
    };

    service.paymentMethod$.next('offchain');
    service.impressions$.next(1500);

    (service as any)
      .assembleDirectBoostPayload(preparedRepsonseMock)
      .then(val => {
        expect(val).toEqual(
          Object({
            guid: '123',
            bidType: 'tokens',
            impressions: 1500,
            checksum: '0x00',
            paymentMethod: Object({ method: 'offchain', address: 'offchain' }),
          })
        );
      });
  });

  it('should correctly assemble boost offer payload', () => {
    const preparedRepsonseMock = {
      status: 'success',
      guid: '123',
      checksum: '0x00',
    };

    (service as any).paymentMethod$.next('offchain');
    service.impressions$.next(1500);

    (service as any)
      .assemblePeerBoostPayload(preparedRepsonseMock)
      .then(val => {
        expect(val).toEqual(
          Object({
            guid: '123',
            bidType: 'tokens',
            impressions: 1500,
            checksum: '0x00',
            paymentMethod: Object({ method: 'offchain', address: 'offchain' }),
          })
        );
      });
  });

  it('should convert impressions to bid', () => {
    expect((service as any).getBid(1)).toBe('1000000000000000000');
  });

  it('should assess whether the user has enough funds', () => {
    expect((service as any).hasBoostFunds(1000, 1000, 1)).toBe(true);
  });

  it('should return false if users impressions amount is out of bounds of the min and max', () => {
    expect((service as any).hasValidImpressions(5001)).toBeFalsy();
    expect((service as any).hasValidImpressions(499)).toBeFalsy();
    expect((service as any).hasValidImpressions(5000)).toBeTruthy();
    expect((service as any).hasValidImpressions(500)).toBeTruthy();
  });
});
