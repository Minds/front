///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { PlusVerify } from '../../mocks/modules/plus/verify';
import { FooterComponentMock } from '../../mocks/modules/plus/footer';
import { FaqMock } from '../../mocks/modules/plus/faq';
import { PlusSubscription } from '../../mocks/modules/plus/subscription';
import { PlusSubscriptionComponent } from './subscription.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignupModalService } from '../../modules/modals/signup/service';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../tests/overlay-modal-service-mock.spec';
import { WireStruc } from '../wire/creator/creator.component';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { WireService } from '../../modules/wire/wire.service';
import { Web3WalletService } from '../blockchain/web3-wallet.service';
import { TokenContractService } from '../blockchain/contracts/token-contract.service';
import { tokenContractServiceMock } from '../../../tests/token-contract-service-mock.spec';
import { MaterialMock } from '../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../tests/material-switch-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';


let web3WalletServiceMock = new function () {
  this.wallets = ['0x123', '0x1234'];
  this.balance = 127000000000000000000;
  this.onChainInterfaceLabel = 'Metamask';
  this.unavailable = false;
  this.locked = false;

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
  this.getCurrentWallet = jasmine.createSpy('getCurrentWallet').and.callFake(async () => {
    return this.wallets[0]
  });
  this.getBalance = jasmine.createSpy('getBalance').and.callFake(async () => {
    return this.balance;
  });

  this.getOnChainInterfaceLabel = jasmine.createSpy('getOnChainInterfaceLabel').and.callFake(() => {
    return this.onChainInterfaceLabel ? this.onChainInterfaceLabel: 'Metamask';
  });
};

let wireServiceMock = new function () {
  this.wireSent = new EventEmitter<any>();
  this.submitWire = jasmine.createSpy('submitWire').and.callFake(async (wireStruc: WireStruc) => {
    return { success: true };
  });
};


let signupServiceMock = new function () {
  this.initOnScroll = jasmine.createSpy('initOnScroll').and.stub();
  this.open = jasmine.createSpy('open').and.stub();
  this.close = jasmine.createSpy('close').and.stub();
};

@Component({
  selector: 'm--crypto-token-symbol',
  template: ''
})
export class MindsTokenSymbolComponent {
}

@Component({
    selector: 'minds-payments-stripe-checkout',
    outputs: ['inputed', 'done'],
    template: ''
  })
  export class StripeCheckoutMock {
    inputed: EventEmitter<any> = new EventEmitter;
    done: EventEmitter<any> = new EventEmitter;
  
    @Input() amount: number = 0;
    @Input() merchant_guid;
    @Input() gateway: string = 'merchants';
  
    @Input('useMDLStyling') useMDLStyling: boolean = true;
  
    @Input() useCreditCard: boolean = true;
    @Input() useBitcoin: boolean = false;
  }

describe('PlusSubscriptionComponent', () => {
  let comp: PlusSubscriptionComponent;
  let fixture: ComponentFixture<PlusSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        PlusSubscriptionComponent,
        PlusSubscription,
        MindsTokenSymbolComponent,
        StripeCheckoutMock,
        PlusVerify,
        FaqMock
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Web3WalletService, useValue: web3WalletServiceMock },
        { provide: Client, useValue: clientMock },
        { provide: WireService, useValue: wireServiceMock },
        { provide: Session, useValue: sessionMock },
        { provide: SignupModalService, useValue: signupServiceMock },
        { provide: TokenContractService, useValue: tokenContractServiceMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(PlusSubscriptionComponent);
    window.Minds.blockchain = {
      plus_address: 'oxtn'
    };
    comp = fixture.componentInstance;
    window.Minds.user = {
      "guid": "732337264197111809",
      "type": "user",
      "subtype": false,
      "time_created": "1499978809",
      "time_updated": false,
      "container_guid": "0",
      "owner_guid": "0",
      "site_guid": false,
      "access_id": "2",
      "name": "minds",
      "username": "minds",
      "language": "en",
      "icontime": "1506690756",
      "legacy_guid": false,
      "featured_id": false,
      "banned": "no",
      "website": "",
      "dob": "",
      "gender": "",
      "city": "",
      "merchant": {},
      "boostProPlus": false,
      "fb": false,
      "mature": 0,
      "monetized": "",
      "signup_method": false,
      "social_profiles": [],
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": true,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
      "subscriber": false,
      "subscriptions_count": 1,
      "impressions": 10248,
      "boost_rating": "2",
      "spam": 0,
      "deleted": 0
    };

    // Set up mock HTTP client
    clientMock.response = {};


    clientMock.response['api/v1/plus'] = {
      'status': 'success',
      'active' : false
    };
    clientMock.response['api/v1/plus/subscription'] = {
      'status': 'success',
      'active' : true
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

  it('Should load correctly', fakeAsync(() => {
    comp.user = {
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": true,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
    }
    const subscription = fixture.debugElement.query(By.css('.m-plus--subscription'));
    expect(subscription).toBeNull();
    fixture.detectChanges();
    expect(comp.isPlus()).toBe(true);
    comp.cancel();

    tick();
    fixture.detectChanges();

    expect(comp.isPlus()).toBe(false);
  }));



  it('Should load using the proper endpoint', () => {
    comp.load();
    fixture.detectChanges();
    expect(comp.isPlus()).toBe(true);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/plus');
  });

  it('Should load correctly plus is false', fakeAsync(() => {
    comp.user = {
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": false,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
    }
    const subscription = fixture.debugElement.query(By.css('.m-plus--subscription'));
    expect(subscription).toBeNull();
    fixture.detectChanges();
    expect(comp.isPlus()).toBe(false);
    comp.purchase(20, 'month');
    tick();
    fixture.detectChanges();

    expect(overlayModalServiceMock.create).toHaveBeenCalled();
  }));

});
