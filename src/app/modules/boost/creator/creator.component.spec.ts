///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { TokenPipe } from '../../../common/pipes/token.pipe';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Scheduler } from '../../../common/components/scheduler/scheduler';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { OffchainPaymentService } from '../../blockchain/offchain-payment.service';

import { BoostCreatorComponent } from './creator.component';
import { BoostService } from '../boost.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { tokenContractServiceMock } from '../../../../tests/token-contract-service-mock.spec';
import { BoostContractService } from '../../blockchain/contracts/boost-contract.service';
import { peerBoostContractServiceMock } from '../../../../tests/peer-boost-contract-service-mock.spec';
import { transactionOverlayServiceMock } from '../../../../tests/transaction-overlay-service-mock.spec';
import { LocalWalletService } from '../../blockchain/local-wallet.service';
import { TransactionOverlayService } from '../../blockchain/transaction-overlay/transaction-overlay.service';
import { localWalletServiceMock } from '../../../../tests/local-wallet-service-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Session } from '../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieModule, CookieService } from '@gorniv/ngx-universal';
import { Storage } from '../../../services/storage';

/* tslint:disable */
@Component({
  selector: 'minds-payments-stripe-checkout',
  outputs: ['inputed', 'done'],
  template: '',
})
export class StripeCheckoutMock {
  inputed: EventEmitter<any> = new EventEmitter();
  done: EventEmitter<any> = new EventEmitter();

  @Input() amount: number = 0;
  @Input() merchant_guid;
  @Input() gateway: string = 'merchants';

  @Input('useMDLStyling') useMDLStyling: boolean = true;

  @Input() useCreditCard: boolean = true;
  @Input() useBitcoin: boolean = false;
}

@Component({
  selector: 'm--categories-selector',
  outputs: ['inputed', 'done'],
  template: '',
})
export class CategoriesSelectorMock {
  inputed: EventEmitter<any> = new EventEmitter();
  done: EventEmitter<any> = new EventEmitter();

  @Input() amount: number = 0;
  @Input() merchant_guid;
  @Input() gateway: string = 'merchants';

  @Input('useMDLStyling') useMDLStyling: boolean = true;

  @Input() useCreditCard: boolean = true;
  @Input() useBitcoin: boolean = false;
}

@Component({
  selector: 'm-boost--creator-payment-methods',
  template: '',
})
export class BoostPaymentMethodsMock {
  @Input() rates;
  @Input() boost;
  @Output() boostChange = new EventEmitter();
}

@Component({
  selector: 'm-boost--creator-categories',
  template: '',
})
export class BoostCategorySelectorMock {
  @Input() boost;
  @Output() boostChange = new EventEmitter();
}

@Component({
  selector: 'm-boost--creator-p2p-search',
  template: '',
})
export class BoostP2PSearchMock {
  @Input() boost;
  @Output() boostChange = new EventEmitter();
}

@Component({
  selector: 'm-boost--creator-checkout',
  template: '',
})
export class BoostCheckoutMock {
  @Input() boost;
  @Output() boostChange = new EventEmitter();
}

let web3WalletServiceMock = new (function() {
  this.wallets = ['0x123', '0x1234'];
  this.balance = 127000000000000000000;
  this.onChainInterfaceLabel = 'Metamask';
  this.unavailable = false;
  this.locked = false;
  this.localWallet = false;

  this.isUnavailable = jasmine.createSpy('isUnavailable').and.callFake(() => {
    return this.unavailable;
  });

  this.unlock = jasmine.createSpy('unlock').and.callFake(async () => {
    return !this.locked;
  });

  this.ready = jasmine.createSpy('ready').and.callFake(async () => {
    return true;
  });

  this.getWallets = jasmine.createSpy('getWallets').and.callFake(async () => {
    return this.wallets;
  });
  this.getCurrentWallet = jasmine
    .createSpy('getCurrentWallet')
    .and.callFake(async () => {
      return this.wallets[0];
    });
  this.getBalance = jasmine.createSpy('getBalance').and.callFake(async () => {
    return this.balance;
  });

  this.isLocal = jasmine.createSpy('isLocal').and.callFake(async () => {
    return this.isLocalWallet;
  });

  this.getOnChainInterfaceLabel = jasmine
    .createSpy('getOnChainInterfaceLabel')
    .and.callFake(() => {
      return this.onChainInterfaceLabel
        ? this.onChainInterfaceLabel
        : 'Metamask';
    });
})();

export const SELECTED_CATEGORIES_MOCK_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectedCategoriesMock),
  multi: true,
};

@Component({
  selector: 'm--selected-categories',
  outputs: ['inputed', 'done'],
  template: '',
  host: {
    change: 'propagateChange($event.target.value)',
  },
  providers: [SELECTED_CATEGORIES_MOCK_VALUE_ACCESSOR],
})
export class SelectedCategoriesMock {
  private selectedCategories: Array<any>;

  unselectCategory(category: any) {
    const index: number = this.selectedCategories.findIndex(value => {
      return value.id === category.id;
    });
    this.selectedCategories.splice(index, 1);
    this.selectedCategories = this.selectedCategories.slice();
  }

  propagateChange = (_: any) => {};

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  writeValue(value: any[]) {
    this.selectedCategories = value;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}
}

@Component({
  selector: 'm--crypto-token-symbol',
  template: '',
})
class CryptoTokenSymbolMock {}

@Component({
  selector: 'm-checkout--blockchain',
  template: '',
})
class BlockchainCheckoutMock {}

describe('BoostCreatorComponent', () => {
  let boostComponent: BoostCreatorComponent;
  let fixture: ComponentFixture<BoostCreatorComponent>;
  let submitSection: DebugElement;
  let boostSubmitButton: DebugElement;

  const boostUser = {
    guid: '123',
    type: 'user',
    subtype: false,
    time_created: '1500037446',
    time_updated: false,
    container_guid: '0',
    owner_guid: '0',
    site_guid: false,
    access_id: '2',
    name: 'minds',
    username: 'minds',
    language: 'en',
    icontime: false,
    legacy_guid: false,
    featured_id: false,
    banned: 'no',
    website: '',
    briefdescription: 'test',
    dob: '',
    gender: '',
    city: '',
    merchant: {
      service: 'stripe',
      id: 'acct_1ApIzEA26BgQpK9C',
      exclusive: { background: 1502453050, intro: '' },
    },
    boostProPlus: false,
    fb: false,
    mature: 0,
    monetized: '',
    signup_method: false,
    social_profiles: [],
    feature_flags: false,
    programs: ['affiliate'],
    plus: false,
    verified: false,
    disabled_boost: false,
    categories: ['news', 'film', 'spirituality'],
    wire_rewards: null,
    subscribed: false,
    subscriber: false,
    subscribers_count: 1,
    subscriptions_count: 1,
    impressions: 337,
    boost_rating: '2',
  };

  const boostActivity = {
    type: 'activity',
    guid: '12345',
    owner_guid: '54321',
  };

  const boostTargetUser = {
    guid: '100000000000000063',
    type: 'user',
    username: 'mark',
    merchant: {
      service: 'stripe',
      id: 'acct_19QgKYEQcGuFgRfS',
      exclusive: {
        enabled: true,
        amount: 2,
        intro: '',
      },
    },
    subscribers_count: 51467,
    impressions: 758644,
    boostProPlus: '1',
    fb: {
      uuid: '578128092345756',
      name: 'Mark"s test page',
    },
  };

  const boostBlog = {
    guid: '111111111',
    type: 'object',
    title: 'MOCK BLOG ENTRY',
    description: 'THIS IS A MOCK BLOCK ENTRY :)',
    ownerObj: boostUser,
    owner_guid: boostUser.guid,
  };

  function getPaymentMethodItem(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `section.m-boost--creator-section-payment > ul.m-boost--creator-selector > li:nth-child(${i})`
      )
    );
  }

  function getAmountInput(): DebugElement {
    return fixture.debugElement.query(
      By.css('input.m-boost--creator-wide-input--edit')
    );
  }

  function getAmountLabel(): DebugElement {
    return fixture.debugElement.query(
      By.css('span.m-boost--creator-wide-input--label')
    );
  }

  function getErrorLabel(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-boost--creator--submit-error')
    );
  }

  function getBoostTypesList(): DebugElement {
    return fixture.debugElement.query(
      By.css(
        'section.m-boost--creator-section-type > ul.m-boost--creator-selector'
      )
    );
  }

  function getBoostTypeItem(i: number) {
    return fixture.debugElement.query(
      By.css(
        `section.m-boost--creator-section-type > ul.m-boost--creator-selector > li:nth-child(${i})`
      )
    );
  }

  function togglePriority() {
    fixture.debugElement
      .query(
        By.css(
          'section.m-boost--creator-section-priority .m-boost--creator-toggle'
        )
      )
      .nativeElement.click();
    fixture.detectChanges();
  }

  function getSubmitButton(): DebugElement {
    return fixture.debugElement.query(
      By.css(
        '.m-boost--creator--submit .m-boost--creator-button.m-boost--creator-button--submit'
      )
    );
  }

  function getNextButton(): DebugElement {
    return fixture.debugElement.query(
      By.css(
        '.m-boost--creator-section-submit .m-boost--creator--submit button.m-boost--creator-button'
      )
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        Scheduler,
        TokenPipe,
        StripeCheckoutMock,
        CategoriesSelectorMock,
        SelectedCategoriesMock,
        CryptoTokenSymbolMock,
        BlockchainCheckoutMock,
        BoostCreatorComponent,
        BoostPaymentMethodsMock,
        BoostCategorySelectorMock,
        BoostP2PSearchMock,
        BoostCheckoutMock,
      ],
      imports: [FormsModule, RouterTestingModule, CookieModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        BoostService,
        { provide: Web3WalletService, useValue: web3WalletServiceMock },
        OffchainPaymentService,
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: TokenContractService, useValue: tokenContractServiceMock },
        {
          provide: BoostContractService,
          useValue: peerBoostContractServiceMock,
        },
        { provide: LocalWalletService, useValue: localWalletServiceMock },
        {
          provide: TransactionOverlayService,
          useValue: transactionOverlayServiceMock,
        },
        Storage,
        CookieService,
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostCreatorComponent);
    boostComponent = fixture.componentInstance;

    // Set up mock HTTP client
    clientMock.response = {};
    clientMock.response['api/v1/guid'] = { status: 'success', guid: '123' };
    // send a boost - POST `api/v1/boost/${boostType}/${this.object.guid}/${this.object.owner_guid}`
    //clientMock.response[`api/v1/boost/peer/${boostActivity.guid}/${boostActivity.owner_guid}`] = { 'status': 'success' };

    // boost.service
    // GET `api/v1/boost/${type}/${filter}`
    // PUT `api/v1/boost/peer/${boost.guid}`
    // DELETE `api/v1/boost/peer/${boost.guid}`
    // P2P DELETE `api/v1/boost/peer/${boost.guid}/revoke`
    // Network DELETE `api/v1/boost/${boost.handler}/${boost.guid}/revoke`

    // boost.component -> GET `api/v1/boost/rates`
    clientMock.response[`api/v2/boost/rates`] = {
      status: 'success',
      balance: 28540,
      hasPaymentMethod: false,
      rate: 1,
      cap: 5000,
      min: 500,
      priority: 1,
      usd: 1000,
      minUsd: 1,
      tokens: 1000,
    };
    // boost.component -> GET `api/v1/search`

    submitSection = fixture.debugElement.query(
      By.css('section.m-boost--creator-section-submit')
    );
    boostSubmitButton = fixture.debugElement.query(
      By.css('.m-boost--creator--submit > button.m-boost--creator-button')
    );

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a title', () => {
    const title = fixture.debugElement.query(
      By.css('.m-boost--creator--header h2')
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Boost');
  });

  it('should have a boost type selection section', () => {
    const boostTypeSection = fixture.debugElement.query(
      By.css('section.m-boost--creator-section-type')
    );
    expect(boostTypeSection).not.toBeNull();
  });

  it('boost type selection section should have a title that says "Boost Type"', () => {
    const boostTypeTitle = fixture.debugElement.query(
      By.css(
        'section.m-boost--creator-section-type > .m-boost--creator-section-title--small'
      )
    );
    expect(boostTypeTitle).not.toBeNull();
    expect(boostTypeTitle.nativeElement.textContent).toContain('Boost Type');
  });

  it('should only offer "sidebars" boost type when the boosted item is NOT an "activity"', () => {
    boostComponent.object = boostUser;
    boostComponent.syncAllowedTypes();
    fixture.detectChanges();

    const availableBoostTypes = getBoostTypesList();
    expect(availableBoostTypes).not.toBeNull();
    expect(availableBoostTypes.nativeElement.children.length).toBe(1);
    expect(
      getBoostTypeItem(1).query(By.css('h4')).nativeElement.textContent
    ).toContain('Sidebars');
  });

  it('should offer both "offers" (p2p) and "newsfeed" boost types when the boosted item is an "activity"', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();
    fixture.detectChanges();

    const availableBoostTypes = getBoostTypesList();
    expect(availableBoostTypes).not.toBeNull();
    expect(availableBoostTypes.nativeElement.children.length).toBe(2);
    expect(
      getBoostTypeItem(1).query(By.css('h4')).nativeElement.textContent
    ).toContain('Feeds');
    expect(
      getBoostTypeItem(2).query(By.css('h4')).nativeElement.textContent
    ).toContain('Offers');
  });

  it('should have an amount of views section, with an input and label', () => {
    expect(
      fixture.debugElement.query(By.css('.m-boost--creator--amount'))
    ).not.toBeNull();
    expect(getAmountInput()).not.toBeNull();
    expect(getAmountLabel()).not.toBeNull();
  });

  it('changing amount input should change the boost"s amount', () => {
    const amountInput: DebugElement = getAmountInput();

    amountInput.nativeElement.value = '10';
    amountInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(boostComponent.boost.amount).toBe(10);
  });

  it('amount of views section should have a title that says "How many views do you want?"', () => {
    const amountSectionTitle = fixture.debugElement.query(
      By.css(
        'section.m-boost--creator-section-amount > .m-boost--creator-section-title--small'
      )
    );
    expect(amountSectionTitle).not.toBeNull();
    expect(amountSectionTitle.nativeElement.textContent).toContain(
      'How many views do you want?'
    );
  });

  it('should have a payment section', () => {
    const paymentSection = fixture.debugElement.query(
      By.css('section.m-boost--creator-section-payment')
    );
    expect(paymentSection).not.toBeNull();
  });

  it('payment section should have a title that says "Payment Method"', () => {
    const paymentTitle = fixture.debugElement.query(
      By.css(
        'section.m-boost--creator-section-payment > .m-boost--creator-section-title--small'
      )
    );
    expect(paymentTitle).not.toBeNull();
    expect(paymentTitle.nativeElement.textContent).toContain('Payment Method');
  });

  it('should have an instance of m-boost--creator-payment-methods', () => {
    const paymentMethods = fixture.debugElement.query(
      By.css(
        'section.m-boost--creator-section-payment m-boost--creator-payment-methods'
      )
    );
    expect(paymentMethods).not.toBeNull();
  });

  it('should have a priority section if credit card is selected', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.boost.currency = 'usd';
    boostComponent.syncAllowedTypes();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('section.m-boost--creator-section-priority')
      )
    ).not.toBeNull();
  });

  it('priority section should not appear if onchain is selected', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.boost.currency = 'onchain';
    boostComponent.syncAllowedTypes();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('section.m-boost--creator-section-priority')
      )
    ).toBeNull();
  });

  it('priority section should not appear if offchain is selected', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.boost.currency = 'offchain';
    boostComponent.syncAllowedTypes();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('section.m-boost--creator-section-priority')
      )
    ).toBeNull();
  });

  it('toggling the priority should affect the boost entity', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();
    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    expect(boostComponent.boost.priority).toBeFalsy();
    togglePriority();
    expect(boostComponent.boost.priority).toBeTruthy();
  });

  it('when selecting credit card "next" button should appear', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    expect(getNextButton()).not.toBeNull();
  });

  it('when selecting credit card "priority" button should appear', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    expect(getNextButton()).not.toBeNull();
  });

  it('"priority" button should toggle boost.priority', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    expect(boostComponent.boost.priority).toBeFalsy();

    togglePriority();

    expect(boostComponent.boost.priority).toBeTruthy();
  });

  it('clicking on the "next" button should show the stripe checkout component', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    getNextButton().nativeElement.click();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('.m-boost--creator-section-checkout m-boost--creator-checkout')
      )
    ).not.toBeNull();
  });

  it('"boost" button should be disabled by default', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    getNextButton().nativeElement.click();
    fixture.detectChanges();

    expect(boostComponent.canSubmit()).toBeFalsy();
  });

  it('if nonce is set, "boost" button should be enabled', () => {
    boostComponent.object = { type: 'activity', guid: '123' };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    getNextButton().nativeElement.click();
    fixture.detectChanges();

    boostComponent.boost.nonce = 'nonce';
    fixture.detectChanges();
    expect(getSubmitButton().nativeElement.disabled).toBeFalsy();
  });

  it('clicking on "boost" should submit the boost', fakeAsync(() => {
    boostComponent.object = {
      type: 'activity',
      guid: '123',
      owner_guid: '789',
    };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'usd';
    fixture.detectChanges();

    getNextButton().nativeElement.click();
    fixture.detectChanges();

    boostComponent.boost.nonce = 'nonce';
    fixture.detectChanges();

    clientMock.response[
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    ] = {
      status: 'success',
      guid: '456',
    };

    spyOn(boostComponent, 'submit').and.callThrough();
    clientMock.get.calls.reset();
    clientMock.post.calls.reset();

    expect(boostComponent.canSubmit()).toBeTruthy();
    expect(boostComponent.inProgress).toBeFalsy();

    getSubmitButton().nativeElement.click();
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    expect(boostComponent.submit).toHaveBeenCalled();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/${boostComponent.object.type}/${boostComponent.object.guid}/${boostComponent.object.owner_guid}`
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      bidType: 'usd',
      categories: [],
      checksum: null,
      guid: null,
      impressions: 1000,
      paymentMethod: 'nonce',
      priority: null,
    });
    tick(3000); // timeout for dismissal
    discardPeriodicTasks();
  }));

  it('should fail submitting an "onchain" boost if wallet is unavailable', fakeAsync(() => {
    web3WalletServiceMock.unavailable = true;
    boostComponent.object = {
      type: 'activity',
      guid: '123',
      owner_guid: '789',
    };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'onchain';
    fixture.detectChanges();

    clientMock.get.calls.reset();

    clientMock.response[
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    ] = {
      status: 'success',
      guid: '456',
      checksum: 'checksum',
    };

    getSubmitButton().nativeElement.click();
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    );

    //it first waits for the wallet to be ready
    expect(web3WalletServiceMock.ready).toHaveBeenCalled();
    expect(web3WalletServiceMock.isUnavailable).toHaveBeenCalled();

    expect(boostComponent.error).toContain(
      'No Ethereum wallets available on your browser.'
    );
  }));

  it('should fail submitting an "onchain" boost if wallet is locked', fakeAsync(() => {
    web3WalletServiceMock.unavailable = false;
    web3WalletServiceMock.locked = true;

    boostComponent.object = {
      type: 'activity',
      guid: '123',
      owner_guid: '789',
    };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'onchain';
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    clientMock.response[
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    ] = {
      status: 'success',
      guid: '456',
      checksum: 'checksum',
    };

    clientMock.get.calls.reset();

    getSubmitButton().nativeElement.click();
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    );

    //it first waits for the wallet to be ready
    expect(web3WalletServiceMock.ready).toHaveBeenCalled();
    expect(web3WalletServiceMock.isUnavailable).toHaveBeenCalled();

    expect(boostComponent.error).toContain(
      'Your Ethereum wallet is locked or connected to another network.'
    );
  }));

  it('should submit an "onchain" boost', fakeAsync(() => {
    web3WalletServiceMock.unavailable = false;
    web3WalletServiceMock.locked = false;
    boostComponent.object = {
      type: 'activity',
      guid: '123',
      owner_guid: '789',
    };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'onchain';
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    clientMock.get.calls.reset();

    clientMock.response[
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    ] = {
      status: 'success',
      guid: '456',
      checksum: 'checksum',
    };

    clientMock.get.calls.reset();
    clientMock.post.calls.reset();

    spyOn(boostComponent, 'submit').and.callThrough();

    getSubmitButton().nativeElement.click();
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    expect(boostComponent.submit).toHaveBeenCalled();

    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    );

    //it first waits for the wallet to be ready
    expect(web3WalletServiceMock.ready).toHaveBeenCalled();

    expect(boostComponent.canSubmit()).toBeTruthy();
    expect(boostComponent.inProgress).toBeFalsy();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/${boostComponent.object.type}/${boostComponent.object.guid}/${boostComponent.object.owner_guid}`
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      bidType: 'tokens',
      categories: [],
      checksum: 'checksum',
      guid: '456',
      impressions: 1000,
      paymentMethod: { method: 'onchain', txHash: 'hash', address: '0x123' },
      priority: null,
    });
    tick(3000); // timeout for dismissal
    discardPeriodicTasks();
  }));

  it('should submit an "offchain" boost', fakeAsync(() => {
    web3WalletServiceMock.unavailable = false;
    web3WalletServiceMock.locked = false;
    boostComponent.object = {
      type: 'activity',
      guid: '123',
      owner_guid: '789',
    };
    boostComponent.syncAllowedTypes();

    boostComponent.boost.currency = 'offchain';
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    clientMock.get.calls.reset();

    clientMock.response[
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    ] = {
      status: 'success',
      guid: '456',
      checksum: 'checksum',
    };

    clientMock.get.calls.reset();
    clientMock.post.calls.reset();

    spyOn(boostComponent, 'submit').and.callThrough();

    getSubmitButton().nativeElement.click();
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(10);

    expect(boostComponent.submit).toHaveBeenCalled();

    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/prepare/${boostComponent.object.guid}`
    );

    expect(boostComponent.canSubmit()).toBeTruthy();
    expect(boostComponent.inProgress).toBeFalsy();

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(
      `api/v2/boost/${boostComponent.object.type}/${boostComponent.object.guid}/${boostComponent.object.owner_guid}`
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      bidType: 'tokens',
      categories: [],
      checksum: 'checksum',
      guid: '456',
      impressions: 1000,
      paymentMethod: { method: 'offchain', address: 'offchain' },
      priority: null,
    });
    tick(3000); // timeout for dismissal
    discardPeriodicTasks();
  }));
});

/*


  /*it('boost button should be disabled either if the user hasn"t entered data, there"s an error, the component"s loading something or just saved the boost', () => {
    spyOn(boostComponent, 'canSubmit').and.returnValue(true);
    fixture.detectChanges();
    expect(boostSubmitButton.nativeElement.disabled).toBeFalsy();

    boostComponent.criticalError = true;
    fixture.detectChanges();
    expect(boostSubmitButton.nativeElement.disabled).toBeTruthy();

    boostComponent.criticalError = false;
    boostComponent.inProgress = true;
    fixture.detectChanges();
    expect(boostSubmitButton.nativeElement.disabled).toBeTruthy();

    boostComponent.inProgress = false;
    boostComponent.success = true;
    fixture.detectChanges();
    expect(boostSubmitButton.nativeElement.disabled).toBeTruthy();

    boostComponent.success = false;
    (<jasmine.Spy>boostComponent.canSubmit).and.returnValue(false);
    fixture.detectChanges();
    expect(boostSubmitButton.nativeElement.disabled).toBeTruthy();
  });

    it('should have a target section with label "Target", description, and search box', () => {
      const boostTargetSection = fixture.debugElement.query(By.css('section.m-boost--creator-section-target'));
      expect(boostTargetSection).not.toBeNull();

      const boostTargetTitle = fixture.debugElement.query(By.css('section.m-boost--creator-section-target > h3'));
      expect(boostTargetTitle).not.toBeNull();
      expect(boostTargetTitle.nativeElement.textContent).toContain('Target');

      const boostTargetDescription = fixture.debugElement.query(By.css('section.m-boost--creator-section-target > h3 > .m-boost--creator-section--title-context'));
      expect(boostTargetDescription).not.toBeNull();

      expect(boostTargetSearchInput).not.toBeNull();
    });

    it('should offer target suggestions when target input is changed', fakeAsync(() => {
      spyOn(boostComponent, 'searchTarget').and.callThrough();
      spyOn(boostComponent, 'setTarget').and.callThrough();

      let searchQuery = 'mark';

      clientMock.get.calls.reset();
      clientMock.response[`api/v1/search`] = {
        'status': 'success',
        'entities': [
          boostTargetUser
        ],
        'load-next': 9
      };

      boostTargetSearchInput.nativeElement.value = searchQuery;
      fixture.detectChanges();
      boostTargetSearchInput.nativeElement.dispatchEvent(new Event('input')); // NB: Need BOTH of these!
      boostTargetSearchInput.nativeElement.dispatchEvent(new Event('keyup')); // NB: Need BOTH of these!
      jasmine.clock().tick(1000);

      expect(boostComponent.searchTarget).toHaveBeenCalled();
      expect(clientMock.get).toHaveBeenCalled();

      tick();

      expect(boostComponent.targetResults.length).toBeGreaterThan(0);
      expect(boostComponent.targetResults[0]).toEqual(boostTargetUser);

      fixture.detectChanges();

      const searchTarget = fixture.debugElement.query(By.css('.m-boost--creator-autocomplete--results > .m-boost--creator-autocomplete--result:first-child'));
      expect(searchTarget).not.toBeNull();
      searchTarget.nativeElement.dispatchEvent(new Event('input'));
      searchTarget.nativeElement.dispatchEvent(new Event('mousedown'));
      searchTarget.nativeElement.click();
      fixture.detectChanges();
      tick();
      jasmine.clock().tick(10);
      expect(boostComponent.setTarget).toHaveBeenCalled();
      expect(boostComponent.boost.target).toEqual(boostTargetUser);
    }));*/
