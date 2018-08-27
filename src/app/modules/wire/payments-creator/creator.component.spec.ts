///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SignupModalService } from '../../../modules/modals/signup/service';
import { VisibleWireError, WireStruc } from '../creator/creator.component';
import { RouterTestingModule } from '@angular/router/testing';
import { WirePaymentsCreatorComponent } from './creator.component';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WireService } from '../wire.service';
import { WireContractService } from '../../blockchain/contracts/wire-contract.service';
import { wireContractServiceMock } from '../../../../tests/wire-contract-service-mock.spec';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { tokenContractServiceMock } from '../../../../tests/token-contract-service-mock.spec';
import { LocalWalletService } from '../../blockchain/local-wallet.service';
import { localWalletServiceMock } from '../../../../tests/local-wallet-service-mock.spec';
import { TransactionOverlayService } from '../../blockchain/transaction-overlay/transaction-overlay.service';
import { transactionOverlayServiceMock } from '../../../../tests/transaction-overlay-service-mock.spec';
import { TooltipComponent } from '../../../common/components/tooltip/tooltip.component';
import { AddressExcerptPipe } from '../../../common/pipes/address-excerpt';
import { TokenPipe } from '../../../common/pipes/token.pipe';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { web3WalletServiceMock } from '../../../../tests/web3-wallet-service-mock.spec';
import { IfFeatureDirective } from '../../../common/directives/if-feature.directive';
import { FeaturesService } from '../../../services/features.service';

/* tslint:disable */
@Component({
  selector: 'm--crypto-token-symbol',
  template: ''
})
class WireCreatorCryptoTokenSymbolMock {
}

@Component({
  selector: 'm-checkout--blockchain',
  template: ''
})
class WireCreatorBlockchainCheckoutMock {
  @Input() autoselect;
}

let wireServiceMock = new function () {
  this.wireSent = new EventEmitter<any>();
  this.submitWire = jasmine.createSpy('submitWire').and.callFake(async (wireStruc: WireStruc) => {
    return { success: true };
  });
};

describe('WirePaymentsCreatorComponent', () => {

  let comp: WirePaymentsCreatorComponent;
  let fixture: ComponentFixture<WirePaymentsCreatorComponent>;
  let submitSection: DebugElement;
  let sendButton: DebugElement;

  const owner: any = {
    'guid': '123',
    'type': 'user',
    'subtype': false,
    'time_created': '1500037446',
    'time_updated': false,
    'container_guid': '0',
    'owner_guid': '0',
    'site_guid': false,
    'access_id': '2',
    'name': 'minds',
    'username': 'minds',
    'eth_wallet': '0x1234',
    'language': 'en',
    'icontime': false,
    'legacy_guid': false,
    'featured_id': false,
    'banned': 'no',
    'website': '',
    'briefdescription': 'test',
    'dob': '',
    'gender': '',
    'city': '',
    'merchant': {
      'service': 'stripe',
      'id': 'acct_1ApIzEA26BgQpK9C',
      'exclusive': { 'background': 1502453050, 'intro': '' }
    },
    'boostProPlus': false,
    'fb': false,
    'mature': 0,
    'monetized': '',
    'signup_method': false,
    'social_profiles': [],
    'feature_flags': false,
    'programs': ['affiliate'],
    'plus': false,
    'verified': false,
    'disabled_boost': false,
    'categories': ['news', 'film', 'spirituality'],
    'wire_rewards': null,
    'subscribed': false,
    'subscriber': false,
    'subscribers_count': 1,
    'subscriptions_count': 1,
    'impressions': 337,
    'boost_rating': '2'
  };

  function getPaymentMethodItem(i: number): DebugElement {
    return fixture.debugElement.query(By.css(`.m-wire--creator-selector > li:nth-child(${i})`));
  }

  function getAmountLabel(): DebugElement {
    return fixture.debugElement.query(By.css('span.m-wire--creator-wide-input--label'));
  }

  function getRecurringCheckbox(): DebugElement {
    return fixture.debugElement.query(By.css('.m-wire--creator--recurring input[type=checkbox]'));
  }

  function getErrorLabel(): DebugElement {
    return fixture.debugElement.query(By.css('.m-wire--creator--submit-error'));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        WireCreatorCryptoTokenSymbolMock,
        WireCreatorBlockchainCheckoutMock,
        WirePaymentsCreatorComponent,
        TooltipComponent,
        AddressExcerptPipe,
        TokenPipe,
        IfFeatureDirective,
      ], // declare the test component
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: WireContractService, useValue: wireContractServiceMock },
        { provide: WireService, useValue: wireServiceMock },
        Web3WalletService,
        FeaturesService,
        { provide: Web3WalletService, useValue: web3WalletServiceMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: TokenContractService, useValue: tokenContractServiceMock },
        { provide: LocalWalletService, useValue: localWalletServiceMock },
        { provide: TransactionOverlayService, useValue: transactionOverlayServiceMock },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WirePaymentsCreatorComponent);
    window.Minds.blockchain = {
        plus_address: 'oxtn'
    }
    comp = fixture.componentInstance; // LoginForm test instance
    clientMock.response = {};
    clientMock.response[`api/v2/boost/rates`] = {
      'status': 'success',
      'balance': 301529,
      'hasPaymentMethod': false,
      'rate': 1,
      'cap': 5000,
      'min': 100,
      'priority': 1,
      'usd': 1000,
      'minUsd': 1
    };
    clientMock.response[`api/v1/wire/rewards/${owner.guid}`] = {
      'status': 'success',
      'username': 'minds',
      'wire_rewards': {
        'description': 'description',
        'rewards': {
          'points': [{ 'amount': 10, 'description': 'description' }, {
            'amount': 100,
            'description': 'description'
          }],
          'money': [{ 'amount': 1, 'description': 'description' }, {
            'amount': 10,
            'description': ':)'
          }, { 'amount': 1000, 'description': 'description' }]
        }
      },
      'merchant': {
        'service': 'stripe',
        'id': 'acct_123',
        'exclusive': { 'background': 1502474954, 'intro': 'Support me!' }
      },
      'eth_wallet': '0x1234',
      'sums': { 'points': '40', 'money': '3096' }
    };
    clientMock.response[`api/v2/blockchain/wallet/balance`] = {
      status: 'success',
      addresses: [
        { address: '0xMOCK', balance: 500 * Math.pow(10, 18), label: 'Receiver' },
        { address: 'offchain', balance: 500 * Math.pow(10, 18), label: 'OffChain' },
      ],
      balance: 1000 * Math.pow(10, 18),
      wireCap: 100 * Math.pow(10, 18)
    };
    clientMock.response[`api/v2/blockchain/rate/tokens`] = {
      status: 'success',
      rate: 10
    };

    submitSection = fixture.debugElement.query(By.css('.m-wire--creator-section--last'));
    sendButton = fixture.debugElement.query(By.css('.m-wire--creator--submit > button.m-wire--creator-button'));

    comp.owner = owner;
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

  it('should have a payment section', () => {
    const section = fixture.debugElement.query(By.css('section.m-wire--creator-payment-section'));
    expect(section).not.toBeNull();
  });

  it('payment section should have a title that says \'Payment Method\'', () => {
    const title = fixture.debugElement.query(By.css('section.m-wire--creator-payment-section > .m-wire--creator-section-title--small'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Payment Method');
  });

  it('should have payment method list (onchain, offchain)', () => {
    const list = fixture.debugElement.query(By.css('section.m-wire--creator-payment-section > ul.m-wire--creator-selector'));
    expect(list).not.toBeNull();

    expect(list.nativeElement.children.length).toBe(3);

    expect(fixture.debugElement.query(By.css('.m-wire--creator-selector > li:first-child > .m-wire--creator-selector-type > h5 > span')).nativeElement.textContent).toContain('OnChain');
    expect(fixture.debugElement.query(By.css('.m-wire--creator-selector > li:nth-child(2) > .m-wire--creator-selector-type > h5 > span')).nativeElement.textContent).toContain('OffChain');
  });

  it('clicking on a payment option should highlight it', fakeAsync(() => {
    comp.setPayloadType('offchain'); // Select other

    fixture.detectChanges();
    tick();

    const onchainOption = getPaymentMethodItem(1);

    expect(onchainOption.nativeElement.classList.contains('m-wire--creator-selector--highlight')).toBeFalsy();
    onchainOption.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(onchainOption.nativeElement.classList.contains('m-wire--creator-selector--highlight')).toBeTruthy();
  }));

  it(`recurring checkbox should toggle wire's recurring property`, () => {

    comp.setPayloadType('onchain');
    fixture.detectChanges();

    expect(comp.wire.recurring).toBe(false);
    const checkbox: DebugElement = getRecurringCheckbox();

    checkbox.nativeElement.click();
    checkbox.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(checkbox).not.toBeNull();
    expect(comp.wire.recurring).toBe(true);
  });

  /*it('if there are any errors, hovering over the submit section should show them', fakeAsync(() => {
    spyOn(comp, 'showErrors').and.callThrough();
    spyOn(comp, 'validate').and.callFake(() => {
      throw new VisibleWireError('I\'m an error');
    });
    submitSection.nativeElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    tick();

    expect(comp.showErrors).toHaveBeenCalled();

    expect(getErrorLabel().nativeElement.textContent).toContain('I\'m an error');
  }));

  it('should have a send button', () => {
    expect(sendButton).not.toBeNull();
  });

  it('send button should call submit()', () => {
    spyOn(comp, 'submit').and.callThrough();
    spyOn(comp, 'canSubmit').and.returnValue(true);

    fixture.detectChanges();

    sendButton.nativeElement.click();

    fixture.detectChanges();

    expect(comp.submit).toHaveBeenCalled();
  });*/
});
