import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import {
  Component,
  DebugElement,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { WalletTokenAddressesComponent } from './addresses.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';

import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { MindsBlogListResponse } from '../../../../interfaces/responses';
import { ContextService } from '../../../../services/context.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockchainService } from '../../../blockchain/blockchain.service';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ConfigsService } from '../../../../common/services/configs.service';

let web3walletMock = new (function() {
  this.getWallets = jasmine
    .createSpy('getWallets')
    .and.stub()
    .and.returnValue(222);
  this.getCurrentWallet = jasmine
    .createSpy('getCurrentWallet')
    .and.returnValue('aaa');
  this.getBalance = jasmine.createSpy('getBalance').and.stub();
  this.isLocal = jasmine.createSpy('isLocal').and.stub();
  this.unlock = jasmine.createSpy('unlock').and.stub();
  this.isSameNetwork = jasmine.createSpy('isSameNetwork').and.stub();
  this.setUp = jasmine.createSpy('setUp').and.stub();
  this.ready = jasmine.createSpy('ready').and.stub();
  this.isUnavailable = jasmine.createSpy('isUnavailable').and.stub();
  this.sendSignedContractMethodWithValue = jasmine
    .createSpy('sendSignedContractMethodWithValue')
    .and.stub();
  this.sendSignedContractMethod = jasmine
    .createSpy('sendSignedContractMethod')
    .and.stub();
  this.getOnChainInterfaceLabel = jasmine
    .createSpy('getOnChainInterfaceLabel')
    .and.stub();
  this.sendTransaction = jasmine.createSpy('sendTransaction').and.stub();
  this.config = {
    rate: 0.4,
  };
})();

describe('WalletTokenAddressesComponent', () => {
  let comp: WalletTokenAddressesComponent;
  let fixture: ComponentFixture<WalletTokenAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'm-token--onboarding--onchain' }),
        WalletTokenAddressesComponent,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Web3WalletService, useValue: web3walletMock },
        { provide: Router, useValue: RouterTestingModule },
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WalletTokenAddressesComponent);

    comp = fixture.componentInstance;

    spyOn(
      fixture.debugElement.injector.get(Session),
      'getLoggedInUser'
    ).and.returnValue({
      eth_wallet: null,
    });

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

  it('should show onboarding', fakeAsync(() => {
    tick();

    expect(comp.editing).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css(`.m-token--onboarding`))
    ).not.toBeNull();
    expect(fixture.debugElement.query(By.css(`.m-card--subtext`))).toBeNull();
  }));

  it('should disable editing', fakeAsync(() => {
    expect(comp.editing).toBeTruthy();
    comp.disableEditing();
    fixture.detectChanges();
    expect(comp.editing).toBeFalsy();
    comp.enableEditing();
    fixture.detectChanges();

    expect(comp.editing).toBeTruthy();
  }));
});
