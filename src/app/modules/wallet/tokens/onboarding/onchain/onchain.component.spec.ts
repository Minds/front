import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  Component,
  DebugElement,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { TokenOnChainOnboardingComponent } from './onchain.component';
import { clientMock } from '../../../../../../tests/client-mock.spec';
import { Client } from '../../../../../services/api/client';
import { LocalWalletService } from '../../../../blockchain/local-wallet.service';
import { localWalletServiceMock } from '../../../../../../tests/local-wallet-service-mock.spec';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../../utils/mock';
import { Session } from '../../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../../tests/session-mock.spec';

import { BlockchainService } from '../../../../blockchain/blockchain.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { Router } from '@angular/router';
import { storageMock } from '../../../../../../tests/storage-mock.spec';
import { Storage } from '../../../../../services/storage';
import { ConfigsService } from '../../../../../common/services/configs.service';

let blockchainService: any = MockService(BlockchainService, {
  getWallet: null,
});

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

describe('TokenOnChainOnboardingComponent', () => {
  let comp: TokenOnChainOnboardingComponent;
  let fixture: ComponentFixture<TokenOnChainOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TokenOnChainOnboardingComponent,
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({
          selector: 'm-token--onboarding--video',
          inputs: ['src'],
        }),
      ],
      imports: [FormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: LocalWalletService, useValue: localWalletServiceMock },
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: RouterTestingModule },
        { provide: BlockchainService, useValue: blockchainService },
        { provide: Web3WalletService, useValue: web3walletMock },
        { provide: Storage, useValue: storageMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(TokenOnChainOnboardingComponent);
    comp = fixture.componentInstance;
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

  it('should create address', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css(`button`))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`.m-token--onboarding--slide`))
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`m-token--onboarding--video`))
    ).not.toBeNull();
    comp.createAddress();
    tick();
    expect(blockchainService.setWallet).toHaveBeenCalled();
  }));

  it('should call next when provided valid address', fakeAsync(() => {
    spyOn(comp.next, 'next').and.stub();
    comp.createAddress();
    comp.providedAddress = '0x8ba5b43846ecf44e08968dd824db544a94e05b2a';

    fixture.detectChanges();
    tick();
    expect(comp.canProvideAddress()).toBeTruthy();
    comp.provideAddress();

    tick();
    expect(comp.next.next).toHaveBeenCalled();
  }));

  it('should use external and detect', fakeAsync(() => {
    spyOn(comp.next, 'next').and.stub();
    comp.providedAddress = '0x8ba5b43846ecf44e08968dd824db544a94e05b2a';
    fixture.detectChanges();
    tick();
    comp.useExternal();
    expect(comp.canProvideAddress()).toBeTruthy();
    comp.provideAddress();
    tick();
    expect(comp.next.next).toHaveBeenCalled();
  }));

  it('should use download', fakeAsync(() => {
    spyOn(comp.next, 'next').and.stub();
    comp.providedAddress = '0x8ba5b43846ecf44e08968dd824db544a94e05b2a';
    fixture.detectChanges();
    tick();
    comp.downloadPrivateKey();
    expect(comp.canProvideAddress()).toBeTruthy();
    spyOn(window, 'open').and.callFake(function() {
      return true;
    });
    comp.downloadMetamask();
    tick();
    expect(comp.downloadingMetamask).toBeTruthy();
  }));
});
