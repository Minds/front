import { of } from 'rxjs';
import { CashWalletService } from './cash.service';

describe('CashWalletService', () => {
  let service: CashWalletService;

  const mockGetResponse = {
    requirements: {
      disabled_reason: 'reason',
    },
    charges_enabled: true,
    payouts_enabled: true,
  };

  const mockPostResponse = {
    status: 'success',
  };

  let apiMock = new (function() {
    this.get = jasmine.createSpy('get').and.returnValue(of(mockGetResponse));
    this.post = jasmine.createSpy('post').and.returnValue(of(mockPostResponse));
  })();

  let experimentsService = new (function() {
    this.hasVariation = jasmine.createSpy('hasVariation').and.returnValue(true);
  })();

  beforeEach(() => {
    service = new CashWalletService(apiMock, experimentsService);
  });

  afterEach(() => {
    (service as any).api.get.calls.reset();
    (service as any).api.post.calls.reset();
    (service as any).experimentsService.hasVariation.calls.reset();

    (service as any).api.get.and.returnValue(of(mockGetResponse));
    (service as any).api.post.and.returnValue(of(mockPostResponse));
    (service as any).experimentsService.hasVariation.and.returnValue(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get account status from api', (done: DoneFn) => {
    service.account$.subscribe(account => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/payments/stripe/connect/account'
      );
      expect(account).toEqual(mockGetResponse);
      done();
    });
  });

  it('should get whether user has an account', (done: DoneFn) => {
    service.hasAccount$.subscribe(account => {
      expect(account).toBeTrue();
      done();
    });
  });

  it('should restrictedReason for account', (done: DoneFn) => {
    service.restrictedReason$.subscribe(restrictedReasonValue => {
      expect(restrictedReasonValue).toBe(
        mockGetResponse.requirements.disabled_reason
      );
      done();
    });
  });

  it('should paymentsEnabled for account', (done: DoneFn) => {
    service.paymentsEnabled$.subscribe(paymentsEnabledValue => {
      expect(paymentsEnabledValue).toBe(mockGetResponse.charges_enabled);
      done();
    });
  });

  it('should payoutsEnabled for account', (done: DoneFn) => {
    service.payoutsEnabled$.subscribe(payoutsEnabledValue => {
      expect(payoutsEnabledValue).toBe(mockGetResponse.payouts_enabled);
      done();
    });
  });

  it('should create an account', async () => {
    await service.createAccount();
    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v3/payments/stripe/connect/account'
    );
  });

  it('should check if experiment is active', async () => {
    (service as any).experimentsService.hasVariation.and.returnValue(true);
    expect(service.isExperimentActive()).toBeTrue();
  });

  it('should check if experiment is NOT active', async () => {
    (service as any).experimentsService.hasVariation.and.returnValue(false);
    expect(service.isExperimentActive()).toBeFalse();
  });
});
