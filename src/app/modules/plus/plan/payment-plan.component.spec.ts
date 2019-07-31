import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

fdescribe('WirePaymentsCreatorComponent', () => {

  let comp: PaymentPlanComponent;
  let fixture: ComponentFixture<PaymentPlanComponent>;

  function getButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-plus-plan__period-buy-button__blue'));
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
        plus_address: 'oxtn'
    }
    // comp.receiver = window.Minds.blockchain.plus_address;
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
    jasmine.clock().uninstall();
  });

  it('should have a purchase button', () => {
    const button = getButton();
    expect(button).not.toBeNull();
  });

  it('should create the payment object for monthly', () => {
    const button = getButton();
    spyOn(comp, 'submit').and.stub();    
    button.nativeElement.click();
    expect(comp.submit).toHaveBeenCalledWith('month');
  });

  it('should set the amount correctly for monthly offchain', () => {
    comp.createWire('offchain month');
    expect(comp.wire.amount).toBe(20);
  });

  it('should create the payment object for yearly', () => {
    const button = getButton();
    spyOn(comp, 'submit').and.stub();    
    button.nativeElement.click();
    expect(comp.submit).toHaveBeenCalledWith('year');
  });

  it('should set the amount correctly for yearly', () => {
    comp.createWire('offchain month');
    expect(comp.wire.amount).toBe(200);
  });

  it('should have a buy life button', () => {
    const button = getButton();
    expect(button).not.toBeNull();
  });

  it('should create the payment object for life', () => {
    const button = getButton();
    spyOn(comp, 'submit').and.stub();    
    button.nativeElement.click();
    expect(comp.submit).toHaveBeenCalledWith('lifetime')
  });
  
  it('should set the amount correctly for lifetime', () => {
    comp.createWire('offchain lifetime');
    expect(comp.wire.amount).toBe(500);
  });

});
