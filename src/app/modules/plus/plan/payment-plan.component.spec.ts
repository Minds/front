import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { PaymentPlanComponent } from './payment-plan.component';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WireService } from '../../wire/wire.service';
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

let overlayModal = new function () {
  this.create = jasmine.createSpy('create').and.callFake(() => {
    return { success: true };
  });
};

describe('WirePaymentsCreatorComponent', () => {

  let comp: PaymentPlanComponent;
  let fixture: ComponentFixture<PaymentPlanComponent>;

  function getPurchaseButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__period-buy-button__blue'));
  }
  
  function getMonthlyOffchainButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__plans div:nth-child(1) input'))
  }

  function getYearlyOnchainButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__plans div:nth-child(2) span:nth-child(3) input'))
  }

  function getYearlyOffchainButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__plans div:nth-child(2) span:nth-child(2) input'))
  }

  function getLifeOnchainButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__plans div:nth-child(3) span:nth-child(3) input'))
  }

  function getLifeOffchainButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__plans div:nth-child(3) span:nth-child(2) input'))
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        PaymentPlanComponent,
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
        { provide: WireService, useValue: overlayModal },
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

    fixture = TestBed.createComponent(PaymentPlanComponent);
    window.Minds.blockchain = {
        plus_address: '0x00000000000000'
    }
    clientMock.response = {};

    clientMock.response[`api/v2/boost/rates`] = {
      'balance': 301529,
      'rate': 1,
      'cap': 5000,
      'min': 100,
      'usd': 1000,
      'tokens': 1
    };
    
    clientMock.response['api/v2/blockchain/wallet/balance'] = {
    addresses: [{
        balance: 1
      },
      {
        balance: 1
      }]
    };

    comp = fixture.componentInstance; // LoginForm test instance

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
    TestBed.resetTestingModule();
    jasmine.clock().uninstall();
  });

  it('should have a purchase button', () => {
    const button = getPurchaseButton();
    expect(button).not.toBeNull();
  });

  it('should have all radio buttons', () => {
    expect(getMonthlyOffchainButton()).not.toBeNull();
    expect(getYearlyOnchainButton()).not.toBeNull();
    expect(getYearlyOffchainButton()).not.toBeNull();
    expect(getLifeOnchainButton()).not.toBeNull();
    expect(getLifeOffchainButton()).not.toBeNull();
  });

  it('radio buttons should change tier value', () => {
    getMonthlyOffchainButton().nativeElement.click();
    expect(comp.tier).toBe('offchain month');
    
    getYearlyOffchainButton().nativeElement.click();
    expect(comp.tier).toBe('offchain year');
    
    getYearlyOnchainButton().nativeElement.click();
    expect(comp.tier).toBe('onchain year');
    
    getLifeOffchainButton().nativeElement.click();
    expect(comp.tier).toBe('offchain lifetime');

    getLifeOnchainButton().nativeElement.click();
    expect(comp.tier).toBe('onchain lifetime');
  });

  it('should call submit on purchase button click', fakeAsync(() => {
    spyOn(comp, 'submit').and.stub();

    getMonthlyOffchainButton().nativeElement.click();
    getPurchaseButton().nativeElement.click();
    
    expect(comp.submit).toHaveBeenCalled();
  }));

  it('should load the current balance', () => fakeAsync(() => {
    comp.load();
    tick();

    expect(comp.inProgress).toBeFalsy();
    expect(comp.rates).toBe({
      'balance': 301529,
      'rate': 1,
      'cap': 5000,
      'min': 100,
      'usd': 1000,
      'tokens': 1
    });
  }));

  it('should create the wire object correctly', fakeAsync(() => {
    comp.createWire('offchain month');
    tick();

    expect(comp.wire).not.toBeNull();
    expect(comp.wire.amount).toBe(20);
    expect(comp.wire.recurring).toBeFalsy();
    expect(comp.wire.guid).not.toBeNull();
  }));
});
