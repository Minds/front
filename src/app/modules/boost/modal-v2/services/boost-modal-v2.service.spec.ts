import { fakeAsync, tick } from '@angular/core/testing';
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
import { BoostGoal, BoostGoalButtonText } from '../../boost.types';
import { MindsUser } from '../../../../interfaces/entities';
import userMock from '../../../../mocks/responses/user.mock';

describe('BoostModalV2Service', () => {
  let service: BoostModalV2Service;

  let apiMock = new (function () {
    this.get = jasmine.createSpy('get').and.returnValue(of({}));
    this.post = jasmine.createSpy('post').and.returnValue(of({}));
  })();

  let toasterMock = new (function () {
    this.error = jasmine.createSpy('error');
    this.success = jasmine.createSpy('success');
  })();

  let configMock = new (function () {
    this.get = jasmine.createSpy('get');
  })();

  let web3WalletMock = new (function () {
    this.checkDeviceIsSupported = jasmine
      .createSpy('checkDeviceIsSupported')
      .and.returnValue(true);
    this.isUnavailable = jasmine
      .createSpy('isUnavailable')
      .and.returnValue(false);
    this.unlock = jasmine
      .createSpy('unlock')
      .and.returnValue(Promise.resolve(true));
  })();

  let boostContractMock = new (function () {
    this.create = jasmine.createSpy('create');
  })();

  let boostTargetExperimentMock = new (function () {
    this.isActive = jasmine.createSpy('isActive');
  })();

  let sessionMock = new (function () {
    this.getLoggedInUser = jasmine
      .createSpy('getLoggedInUser')
      .and.returnValue(userMock);
  })();

  beforeEach(() => {
    service = new BoostModalV2Service(
      apiMock,
      sessionMock,
      toasterMock,
      configMock,
      web3WalletMock,
      boostContractMock,
      boostTargetExperimentMock
    );

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
    (service as any).api.get.calls.reset();
    (service as any).session.getLoggedInUser.calls.reset();
    (service as any).toast.error.calls.reset();
    (service as any).toast.success.calls.reset();
    (service as any).config.get.calls.reset();
    (service as any).web3Wallet.checkDeviceIsSupported.calls.reset();
    (service as any).web3Wallet.isUnavailable.calls.reset();
    (service as any).web3Wallet.unlock.calls.reset();
    (service as any).boostContract.create.calls.reset();

    (service as any).api.post.and.returnValue(of({}));
    (service as any).session.getLoggedInUser.and.returnValue(userMock);
    (service as any).web3Wallet.checkDeviceIsSupported.and.returnValue(true);
    (service as any).web3Wallet.isUnavailable.and.returnValue(false);
    (service as any).web3Wallet.unlock.and.returnValue(Promise.resolve(true));
    (service as any).boostContract.create.and.returnValue('0x123');
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
    service.entityType$.subscribe((val) => {
      expect(val).toBe(BoostSubject.CHANNEL);
      done();
    });
  });

  it('should get entity type for a post', (done: DoneFn) => {
    service.entity$.next({
      guid: '123',
      type: 'group',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });
    service.entityType$.subscribe((val) => {
      expect(val).toBe(BoostSubject.GROUP);
      done();
    });
  });

  it('should get entity type for a post', (done: DoneFn) => {
    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });
    service.entityType$.subscribe((val) => {
      expect(val).toBe(BoostSubject.POST);
      done();
    });
  });

  it('should get total payment amount', (done: DoneFn) => {
    service.duration$.next(30);
    service.dailyBudget$.next(10);

    service.totalPaymentAmount$.subscribe((val) => {
      expect(val).toBe(300);
      done();
    });
  });

  it('should get total payment amount', (done: DoneFn) => {
    service.duration$.next(30);
    service.dailyBudget$.next(10);

    service.totalPaymentAmount$.subscribe((val) => {
      expect(val).toBe(300);
      done();
    });
  });

  it('should get total payment amount text for tokens', (done: DoneFn) => {
    service.paymentCategory$.next(BoostPaymentCategory.TOKENS);

    service.totalPaymentAmountText$.subscribe((val) => {
      expect(val).toBe('5 tokens');
      done();
    });
  });

  it('should get total payment amount text for cash', (done: DoneFn) => {
    service.paymentCategory$.next(BoostPaymentCategory.CASH);
    service.duration$.next(30);
    service.dailyBudget$.next(10);

    service.totalPaymentAmountText$.subscribe((val) => {
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
      rejection_reasons: [
        {
          code: 1,
          label: '',
        },
      ],
    };

    (service as any).config.get.and.returnValue(mockConfig);
    expect(service.getConfig()).toEqual(mockConfig);
  });

  it('should change panel from the audience panel', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.AUDIENCE);
    service.changePanelFrom(BoostModalPanel.AUDIENCE);
    service.activePanel$.subscribe((val) => {
      expect(val).toBe(BoostModalPanel.BUDGET);
      done();
    });
  });

  it('should change panel from the audience panel', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.BUDGET);
    service.changePanelFrom(BoostModalPanel.BUDGET);
    service.activePanel$.subscribe((val) => {
      expect(val).toBe(BoostModalPanel.REVIEW);
      done();
    });
  });

  it('should submit a boost when changing panel from the review panel for user in channel sidebar', () => {
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

  it('should submit a boost when changing panel from the review panel for group in channel sidebar', () => {
    service.paymentMethod$.next(BoostPaymentMethod.CASH);
    service.paymentMethodId$.next('pay_123');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.SAFE);
    service.entity$.next({
      guid: '123',
      type: 'group',
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

  it('should submit a boost with a boost goal', () => {
    let loggedInUser: MindsUser = sessionMock;
    loggedInUser.guid = '123';

    (service as any).session.getLoggedInUser.and.returnValue(loggedInUser);

    service.paymentMethod$.next(BoostPaymentMethod.OFFCHAIN_TOKENS);
    service.paymentMethodId$.next('');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.CONTROVERSIAL);
    service.goal$.next(BoostGoal.CLICKS);
    service.goalButtonText$.next(BoostGoalButtonText.GET_STARTED);
    service.goalButtonUrl$.next('~url~');

    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '123',
      time_created: '99999999999',
    });

    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.changePanelFrom(BoostModalPanel.REVIEW);

    expect((service as any).api.post).toHaveBeenCalledWith('api/v3/boosts', {
      entity_guid: '123',
      target_suitability: 2,
      target_location: 1,
      payment_method: 2,
      payment_method_id: '',
      daily_bid: 15,
      duration_days: 30,
      goal: BoostGoal.CLICKS,
      goal_button_text: BoostGoalButtonText.GET_STARTED,
      goal_button_url: '~url~',
    });
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  });

  it('should submit a boost without a boost goal payload when entity is a user', () => {
    let loggedInUser: MindsUser = sessionMock;
    loggedInUser.guid = '123';

    (service as any).session.getLoggedInUser.and.returnValue(loggedInUser);

    service.paymentMethod$.next(BoostPaymentMethod.OFFCHAIN_TOKENS);
    service.paymentMethodId$.next('');
    service.duration$.next(30);
    service.dailyBudget$.next(15);
    service.audience$.next(BoostAudience.CONTROVERSIAL);
    service.goal$.next(BoostGoal.CLICKS);
    service.goalButtonText$.next(BoostGoalButtonText.GET_STARTED);
    service.goalButtonUrl$.next('~url~');
    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '123',
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

  xit('should submit an onchain boost', fakeAsync(() => {
    const preparedGuid = '345678';
    const preparedChecksum = 'ch4ck5um';
    (service as any).api.get.and.returnValue(
      of({
        status: 'success',
        guid: preparedGuid,
        checksum: preparedChecksum,
      })
    );
    (service as any).boostContract.create.and.returnValue('0x123');

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).toHaveBeenCalled();
    expect((service as any).boostContract.create).toHaveBeenCalledWith(
      preparedGuid,
      450,
      preparedChecksum
    );
    expect((service as any).api.post).toHaveBeenCalledWith('api/v3/boosts', {
      entity_guid: '123',
      target_suitability: 2,
      target_location: 2,
      goal: 1,
      goal_button_text: null,
      goal_button_url: null,
      payment_method: 3,
      payment_method_id: null,
      daily_bid: 15,
      duration_days: 30,
      guid: preparedGuid,
      payment_tx_id: '0x123',
    });
    expect((service as any).toast.success).toHaveBeenCalledWith(
      'Success! Your boost request is being processed.'
    );
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  it('should handle an error calling to prepare endpoint when submitting an onchain boost', fakeAsync(() => {
    (service as any).api.post.and.throwError(
      of({
        error: { message: 'error' },
      })
    );

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).toast.error).toHaveBeenCalled();
    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).not.toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).not.toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).not.toHaveBeenCalled();
    expect((service as any).boostContract.create).not.toHaveBeenCalled();
    //expect((service as any).api.post).not.toHaveBeenCalled();
    expect((service as any).toast.success).not.toHaveBeenCalled();
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  it('should handle an error calling when device is unsupported when submitting an onchain boost', fakeAsync(() => {
    const preparedGuid = '345678';
    const preparedChecksum = 'ch4ck5um';
    (service as any).api.post.and.returnValue(
      of({
        status: 'success',
        guid: preparedGuid,
        checksum: preparedChecksum,
      })
    );
    (service as any).web3Wallet.checkDeviceIsSupported.and.returnValue(false);

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).toast.error).toHaveBeenCalledWith(
      'Currently not supported on this device.'
    );
    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).not.toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).not.toHaveBeenCalled();
    expect((service as any).boostContract.create).not.toHaveBeenCalled();
    //expect((service as any).api.post).not.toHaveBeenCalled();
    expect((service as any).toast.success).not.toHaveBeenCalled();
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  it('should handle an error calling when wallet is unavailable when submitting an onchain boost', fakeAsync(() => {
    const preparedGuid = '345678';
    const preparedChecksum = 'ch4ck5um';
    (service as any).api.post.and.returnValue(
      of({
        status: 'success',
        guid: preparedGuid,
        checksum: preparedChecksum,
      })
    );
    (service as any).web3Wallet.isUnavailable.and.returnValue(true);

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).toast.error).toHaveBeenCalledWith(
      'No Ethereum wallets available on your browser.'
    );
    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).not.toHaveBeenCalled();
    expect((service as any).boostContract.create).not.toHaveBeenCalled();
    //expect((service as any).api.post).not.toHaveBeenCalled();
    expect((service as any).toast.success).not.toHaveBeenCalled();
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  it('should handle an error calling when wallet is unavailable when submitting an onchain boost', fakeAsync(() => {
    const preparedGuid = '345678';
    const preparedChecksum = 'ch4ck5um';
    (service as any).api.post.and.returnValue(
      of({
        status: 'success',
        guid: preparedGuid,
        checksum: preparedChecksum,
      })
    );
    (service as any).web3Wallet.unlock.and.returnValue(Promise.resolve(false));

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).toast.error).toHaveBeenCalledWith(
      'Your Ethereum wallet is locked or connected to another network.'
    );
    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).toHaveBeenCalled();
    expect((service as any).boostContract.create).not.toHaveBeenCalled();
    //expect((service as any).api.post).not.toHaveBeenCalled();
    expect((service as any).toast.success).not.toHaveBeenCalled();
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  it('should handle an error submitting a transaction when submitting an onchain boost', fakeAsync(() => {
    const preparedGuid = '345678';
    const preparedChecksum = 'ch4ck5um';
    const errorMessage = '~errorMessage~';

    (service as any).api.post.and.returnValue(
      of({
        status: 'success',
        guid: preparedGuid,
        checksum: preparedChecksum,
      })
    );
    (service as any).boostContract.create.and.throwError(errorMessage);

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).toast.error).toHaveBeenCalledWith(errorMessage);
    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).toHaveBeenCalled();
    expect((service as any).boostContract.create).toHaveBeenCalled();
    //expect((service as any).api.post).not.toHaveBeenCalled();
    expect((service as any).toast.success).not.toHaveBeenCalled();
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  xit('should handle an error when submitting an onchain boost to API', fakeAsync(() => {
    const preparedGuid = '345678';
    const preparedChecksum = 'ch4ck5um';

    (service as any).api.post.and.returnValue(
      of({
        status: 'success',
        guid: preparedGuid,
        checksum: preparedChecksum,
      })
    );
    (service as any).api.post.and.throwError('Error!');

    service.paymentMethod$.next(BoostPaymentMethod.ONCHAIN_TOKENS);
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
    tick();

    expect((service as any).toast.error).toHaveBeenCalled();
    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/boosts/prepare-onchain/123`
    );
    expect(
      (service as any).web3Wallet.checkDeviceIsSupported
    ).toHaveBeenCalled();
    expect((service as any).web3Wallet.isUnavailable).toHaveBeenCalled();
    expect((service as any).web3Wallet.unlock).toHaveBeenCalled();
    expect((service as any).boostContract.create).toHaveBeenCalled();
    expect((service as any).api.post).toHaveBeenCalled();
    expect((service as any).toast.success).not.toHaveBeenCalled();
    expect((service as any).boostSubmissionInProgress$.getValue()).toBeFalse();
  }));

  it('should navigate to previous panel from budget', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.BUDGET);
    service.openPreviousPanel();
    service.activePanel$.subscribe((val) => {
      expect(val).toBe(BoostModalPanel.AUDIENCE);
      done();
    });
  });

  it('should navigate to previous panel from review', (done: DoneFn) => {
    service.activePanel$.next(BoostModalPanel.REVIEW);
    service.openPreviousPanel();
    service.activePanel$.subscribe((val) => {
      expect(val).toBe(BoostModalPanel.BUDGET);
      done();
    });
  });

  it('should NOT navigate to previous panel from audience', (done: DoneFn) => {
    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.activePanel$.next(BoostModalPanel.AUDIENCE);
    service.openPreviousPanel();
    service.activePanel$.subscribe((val) => {
      expect(val).toBe(BoostModalPanel.AUDIENCE);
      done();
    });
  });

  it('should emit when GOAL panel is active', (done: DoneFn) => {
    let loggedInUser: MindsUser = sessionMock;
    loggedInUser.guid = '234';

    (service as any).session.getLoggedInUser.and.returnValue(loggedInUser);

    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.firstPanel$.subscribe((panel: BoostModalPanel): void => {
      expect(panel).toBe(BoostModalPanel.GOAL);
      done();
    });
  });

  it('should emit AUDIENCE panel when entity owner is not user', (done: DoneFn) => {
    let loggedInUser: MindsUser = sessionMock;
    loggedInUser.guid = '234';

    (service as any).session.getLoggedInUser.and.returnValue(loggedInUser);

    service.entity$.next({
      guid: '123',
      type: 'activity',
      subtype: '',
      owner_guid: '345',
      time_created: '99999999999',
    });

    service.firstPanel$.subscribe((panel: BoostModalPanel): void => {
      expect(panel).toBe(BoostModalPanel.AUDIENCE);
      done();
    });
  });

  it('should emit AUDIENCE panel when entity type is NOT post', (done: DoneFn) => {
    let loggedInUser: MindsUser = sessionMock;
    loggedInUser.guid = '234';

    (service as any).session.getLoggedInUser.and.returnValue(loggedInUser);

    service.entity$.next({
      guid: '123',
      type: 'user',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    });

    service.firstPanel$.subscribe((panel: BoostModalPanel): void => {
      expect(panel).toBe(BoostModalPanel.AUDIENCE);
      done();
    });
  });
});
