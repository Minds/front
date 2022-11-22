import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { web3WalletServiceMock } from '../../../../tests/web3-wallet-service-mock.spec';
import { BoostModalService } from './boost-modal.service';

export let apiServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
  this.get = jasmine.createSpy('get').and.returnValue(new Observable(null));
  this.post = jasmine.createSpy('post').and.returnValue(of({}));
})();

export let toasterServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

export let boostContractServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

export let cashExperimentMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

export let configsMock = new (function() {
  this.get = jasmine.createSpy('get').and.returnValue({});
})();

describe('BoostModalService', () => {
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
      boostContractServiceMock,
      cashExperimentMock,
      configsMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should call to fetch balance', (done: DoneFn) => {
    const response = {
      addresses: [
        {
          address: '0x00',
          label: 'onchain',
          balance: '1000000000000000000000',
        },
        {
          address: 'offchain',
          label: 'offchain',
          balance: '2000000000000000000000',
        },
      ],
    };

    (service as any).api.get.and.returnValue(of(response));
    service.fetchTokenBalance().subscribe(val => {
      expect(apiServiceMock.get).toHaveBeenCalledWith(
        'api/v2/blockchain/wallet/balance'
      );
      expect(val).toEqual(response);
      expect(service.offchainBalance$.getValue()).toBe(2000);
      expect(service.onchainBalance$.getValue()).toBe(1000);
      done();
    });
  });

  it('should boost for tokens', fakeAsync(() => {
    const entity = {
      guid: '123',
      owner_guid: '234',
      type: 'activity',
    };
    const response = {
      status: 'success',
      guid: '123',
      checksum: '213123123',
    };
    service.entity$.next(entity);
    service.activeTab$.next('tokens');

    (service as any).api.get.and.returnValue(of(response));
    (service as any).api.post.and.returnValue(of(null));

    service.submitBoostAsync();
    tick();

    expect(apiServiceMock.get).toHaveBeenCalledWith('api/v2/boost/prepare/123');
    expect(apiServiceMock.post).toHaveBeenCalledWith(
      'api/v2/boost/activity/123/234',
      {
        guid: '123',
        bidType: 'tokens',
        impressions: 2500,
        checksum: '213123123',
        paymentMethod: {
          method: 'offchain',
          address: 'offchain',
        },
      }
    );
  }));

  it('should boost for cash', fakeAsync(() => {
    const entity = {
      guid: '123',
      owner_guid: '234',
      type: 'activity',
    };
    const response = {
      status: 'success',
      guid: '123',
      checksum: '213123123',
    };
    service.entity$.next(entity);
    service.activeTab$.next('cash');
    service.cashPaymentMethod$.next('pay_123');

    (service as any).api.get.and.returnValue(of(response));
    (service as any).api.post.and.returnValue(of(null));

    service.submitBoostAsync();
    tick();

    expect(apiServiceMock.get).toHaveBeenCalledWith('api/v2/boost/prepare/123');
    expect(apiServiceMock.post).toHaveBeenCalledWith(
      'api/v2/boost/activity/123/234',
      {
        guid: '123',
        bidType: 'cash',
        impressions: 2500,
        checksum: '213123123',
        paymentMethod: {
          method: 'cash',
          payment_method_id: 'pay_123',
        },
      }
    );
  }));

  it('should assess whether the user has enough funds', () => {
    expect((service as any).hasTokenBoostFunds(1000, 1000, 1)).toBe(true);
  });

  it('should return false if users impressions amount is out of bounds of the min and max', () => {
    expect((service as any).hasValidImpressions(5001)).toBeFalsy();
    expect((service as any).hasValidImpressions(499)).toBeFalsy();
    expect((service as any).hasValidImpressions(5000)).toBeTruthy();
    expect((service as any).hasValidImpressions(500)).toBeTruthy();
  });
});
