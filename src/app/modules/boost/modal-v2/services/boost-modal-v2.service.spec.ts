import { of } from 'rxjs';
import {
  BoostAudience,
  BoostConfig,
  BoostModalPanel,
  BoostPaymentCategory,
  BoostPaymentMethod,
  BoostSubject,
} from '../boost-modal-v2.types';
import { BoostModalV2Service } from './boost-modal-v2.service';

describe('BoostModalV2Service', () => {
  let service: BoostModalV2Service;

  let apiMock = new (function() {
    this.post = jasmine.createSpy('post').and.returnValue(of({}));
  })();

  let toasterMock = new (function() {
    this.error = jasmine.createSpy('error');
    this.success = jasmine.createSpy('success');
  })();

  let configMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  beforeEach(() => {
    service = new BoostModalV2Service(apiMock, toasterMock, configMock);

    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });
  });

  afterEach(() => {
    (service as any).api.post.calls.reset();
    (service as any).toast.error.calls.reset();
    (service as any).toast.success.calls.reset();
    (service as any).config.get.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get entity type for a user', (done: DoneFn) => {
    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });
    service.entityType$.subscribe(val => {
      expect(val).toBe(BoostSubject.CHANNEL);
      done();
    });
  });

  it('should get entity type for a non-user', (done: DoneFn) => {
    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });
    service.entityType$.subscribe(val => {
      expect(val).toBe(BoostSubject.POST);
      done();
    });
  });

  it('should get total payment amount', (done: DoneFn) => {
    service.duration$.next(30);
    service.dailyBudget$.next(10);

    service.totalPaymentAmount$.subscribe(val => {
      expect(val).toBe(300);
      done();
    });
  });

  it('should get total payment amount', (done: DoneFn) => {
    service.duration$.next(30);
    service.dailyBudget$.next(10);

    service.totalPaymentAmount$.subscribe(val => {
      expect(val).toBe(300);
      done();
    });
  });

  it('should get total payment amount text for tokens', (done: DoneFn) => {
    service.paymentCategory$.next(BoostPaymentCategory.TOKENS);

    service.totalPaymentAmountText$.subscribe(val => {
      expect(val).toBe('5 tokens');
      done();
    });
  });

  it('should get total payment amount text for cash', (done: DoneFn) => {
    service.paymentCategory$.next(BoostPaymentCategory.CASH);
    service.duration$.next(30);
    service.dailyBudget$.next(10);

    service.totalPaymentAmountText$.subscribe(val => {
      expect(val).toBe('$300.00');
      done();
    });
  });

  it('should get config', () => {
    const mockConfig: BoostConfig = {
      min: {
        cash: 1,
        offchain_tokens: 2,
        onchain_tokens: 3,
      },
      max: {
        cash: 1000,
        offchain_tokens: 2000,
        onchain_tokens: 3000,
      },
      duration: {
        min: 1,
        max: 30,
      },
      bid_increments: {
        cash: [1, 2, 3, 5, 100],
        offchain_tokens: [1, 2, 3, 5, 100],
        onchain_tokens: [1, 2, 3, 5, 100],
      },
    };

    (service as any).config.get.and.returnValue(mockConfig);
    expect(service.getConfig()).toEqual(mockConfig);
  });

  it('should change panel from the audience panel', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.AUDIENCE);
    service.changePanelFrom(BoostModalPanel.AUDIENCE);
    service.activePanel$.subscribe(val => {
      expect(val).toBe(BoostModalPanel.BUDGET);
      done();
    });
  });

  it('should change panel from the audience panel', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.BUDGET);
    service.changePanelFrom(BoostModalPanel.BUDGET);
    service.activePanel$.subscribe(val => {
      expect(val).toBe(BoostModalPanel.REVIEW);
      done();
    });
  });

  it('should submit a boost when changing panel from the review panel for newsfeed', () => {
    service.paymentMethod$.next(BoostPaymentMethod.CASH);
    service.paymentMethodId$.next('pay_123');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.SAFE);
    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.changePanelFrom(BoostModalPanel.REVIEW);

    expect((service as any).api.post).toHaveBeenCalledWith('api/v3/boosts', {
      entity_guid: '123',
      target_suitability: 1,
      target_location: 1,
      payment_method: 1,
      payment_method_id: 'pay_123',
      daily_bid: 15,
      duration_days: 30,
    });
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  });

  it('should submit a boost when changing panel from the review panel for channel sidebar', () => {
    service.paymentMethod$.next(BoostPaymentMethod.CASH);
    service.paymentMethodId$.next('pay_123');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.SAFE);
    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.changePanelFrom(BoostModalPanel.REVIEW);

    expect((service as any).api.post).toHaveBeenCalledWith('api/v3/boosts', {
      entity_guid: '123',
      target_suitability: 1,
      target_location: 2,
      payment_method: 1,
      payment_method_id: 'pay_123',
      daily_bid: 15,
      duration_days: 30,
    });
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  });

  it('should submit a boost when changing panel from the review panel for controversial', () => {
    service.paymentMethod$.next(BoostPaymentMethod.CASH);
    service.paymentMethodId$.next('pay_123');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.CONTROVERSIAL);
    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.changePanelFrom(BoostModalPanel.REVIEW);

    expect((service as any).api.post).toHaveBeenCalledWith('api/v3/boosts', {
      entity_guid: '123',
      target_suitability: 2,
      target_location: 2,
      payment_method: 1,
      payment_method_id: 'pay_123',
      daily_bid: 15,
      duration_days: 30,
    });
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  });

  it('should submit a boost when changing panel from the review panel for offchain tokens', () => {
    service.paymentMethod$.next(BoostPaymentMethod.OFFCHAIN_TOKENS);
    service.paymentMethodId$.next('');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.CONTROVERSIAL);
    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.changePanelFrom(BoostModalPanel.REVIEW);

    expect((service as any).api.post).toHaveBeenCalledWith('api/v3/boosts', {
      entity_guid: '123',
      target_suitability: 2,
      target_location: 2,
      payment_method: 2,
      payment_method_id: '',
      daily_bid: 15,
      duration_days: 30,
    });
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  });

  it('should navigate to previous panel from budget', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.BUDGET);
    service.openPreviousPanel();
    service.activePanel$.subscribe(val => {
      expect(val).toBe(BoostModalPanel.AUDIENCE);
      done();
    });
  });

  it('should navigate to previous panel from review', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.openPreviousPanel();
    service.activePanel$.subscribe(val => {
      expect(val).toBe(BoostModalPanel.BUDGET);
      done();
    });
  });

  it('should NOT navigate to previous panel from audience', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.AUDIENCE);
    service.openPreviousPanel();
    service.activePanel$.subscribe(val => {
      expect(val).toBe(BoostModalPanel.AUDIENCE);
      done();
    });
  });
});
