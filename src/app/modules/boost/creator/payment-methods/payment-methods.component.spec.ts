///<reference path="../../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, DebugElement, EventEmitter, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MaterialMock } from '../../../../../tests/material-mock.spec';
import { BoostCreatorPaymentMethodsComponent } from './payment-methods.component';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { BoostService } from '../../boost.service';
import { TokenContractService } from '../../../blockchain/contracts/token-contract.service';
import { tokenContractServiceMock } from '../../../../../tests/token-contract-service-mock.spec';
import { TooltipComponentMock } from '../../../../mocks/common/components/tooltip/tooltip.component';
import { AddressExcerptPipe } from '../../../../common/pipes/address-excerpt';
import { TokenPipe } from '../../../../common/pipes/token.pipe';
import { localWalletServiceMock } from '../../../../../tests/local-wallet-service-mock.spec';
import { transactionOverlayServiceMock } from '../../../../../tests/transaction-overlay-service-mock.spec';
import { TransactionOverlayService } from '../../../blockchain/transaction-overlay/transaction-overlay.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../../tests/modal-service-mock.spec';

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
  selector: 'm-checkout--blockchain',
  template: '',
})
class BlockchainCheckoutMock {}

let web3WalletServiceMock = new (function() {
  this.wallets = ['0x123', '0x1234'];
  this.balance = 127000000000000000000;
  this.onChainInterfaceLabel = 'Metamask';
  this.unavailable = false;
  this.locked = false;

  this.isUnavailable = jasmine
    .createSpy('isUnavailable')
    .and.callFake(async () => {
      return this.unavailable;
    });

  this.unlock = jasmine.createSpy('unlock').and.callFake(async () => {
    return this.locked;
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

  this.getOnChainInterfaceLabel = jasmine
    .createSpy('getOnChainInterfaceLabel')
    .and.callFake(() => {
      return this.onChainInterfaceLabel
        ? this.onChainInterfaceLabel
        : 'Metamask';
    });
})();

describe('BoostCreatorPaymentMethodsComponent', () => {
  let comp: BoostCreatorPaymentMethodsComponent;
  let fixture: ComponentFixture<BoostCreatorPaymentMethodsComponent>;

  function getPaymentOption(i: 1 | 2 | 3): DebugElement {
    return fixture.debugElement.query(
      By.css(`ul.m-boost--creator-selector > li:nth-child(${i})`)
    );
  }

  function getPaymentOptionTitle(i: 1 | 2 | 3): DebugElement {
    return fixture.debugElement.query(
      By.css(`ul.m-boost--creator-selector > li:nth-child(${i}) h5 span`)
    );
  }

  function getPaymentOptionBalance(i: 1 | 2): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `ul.m-boost--creator-selector > li:nth-child(${i}) span.m-boost--creator-selector--description`
      )
    );
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MaterialMock,
          TooltipComponentMock,
          AddressExcerptPipe,
          TokenPipe,
          BoostCreatorPaymentMethodsComponent,
        ],
        imports: [RouterTestingModule, FormsModule],
        providers: [
          { provide: Client, useValue: clientMock },
          BoostService,
          { provide: Web3WalletService, useValue: web3WalletServiceMock },
          {
            provide: TransactionOverlayService,
            useValue: transactionOverlayServiceMock,
          },
          { provide: TokenContractService, useValue: tokenContractServiceMock },
          { provide: ModalService, useValue: modalServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostCreatorPaymentMethodsComponent);
    comp = fixture.componentInstance;

    // Set up mock HTTP client
    clientMock.response = {};

    clientMock.response['api/v2/blockchain/wallet/balance'] = {
      status: 'success',
      addresses: [
        { address: '0xonchain', balance: 500000000000000000000 }, // onchain
        { address: '0xoffchain', balance: 7000000000000000000 }, // offchain
      ],
    };

    comp.boost = {
      amount: 1000,
      currency: null,
      type: 'newsfeed',

      // General
      categories: [],
      priority: false,

      // P2P
      target: null,
      postToFacebook: false,
      scheduledTs: null,

      // Payment
      nonce: null,
    };

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

  it('should have a list of two payment options', () => {
    expect(getPaymentOption(1)).not.toBeNull();
    expect(getPaymentOption(2)).not.toBeNull();
    //expect(getPaymentOption(3)).not.toBeNull();
  });

  it('should an onchain payment option', () => {
    expect(getPaymentOptionTitle(1).nativeElement.textContent).toContain(
      'OnChain'
    );
  });

  it('clicking on the onchain payment option should set the currency to onchain', () => {
    getPaymentOption(1).nativeElement.click();
    fixture.detectChanges();

    expect(getPaymentOptionTitle(1).nativeElement.textContent).toContain(
      'OnChain'
    );
    expect(comp.boost.currency).toBe('onchain');
  });

  it('clicking on the offchain payment option should set the currency to offchain', () => {
    getPaymentOption(2).nativeElement.click();
    fixture.detectChanges();

    expect(getPaymentOptionTitle(2).nativeElement.textContent).toContain(
      'OffChain'
    );
    expect(comp.boost.currency).toBe('offchain');
  });

  xit('clicking on the creditcard payment option should set the currency to usd', () => {
    getPaymentOption(3).nativeElement.click();
    fixture.detectChanges();

    expect(getPaymentOptionTitle(3).nativeElement.textContent).toContain(
      'Credit Card'
    );
    expect(comp.boost.currency).toBe('usd');
  });

  xit('on p2p, clicking on the creditcard payment option should set the currency to creditcard', () => {
    comp.boost.type = 'p2p';
    fixture.detectChanges();

    getPaymentOption(3).nativeElement.click();
    fixture.detectChanges();

    expect(getPaymentOptionTitle(3).nativeElement.textContent).toContain(
      'Credit Card'
    );
    expect(comp.boost.currency).toBe('creditcard');
  });

  it('both the onchain and the offchain payment option should show the current balance', () => {
    fixture.detectChanges();
    expect(getPaymentOptionBalance(1).nativeElement.textContent).toContain(500);
    expect(getPaymentOptionBalance(2).nativeElement.textContent).toContain(7);
  });
});
