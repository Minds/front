import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { WalletBalanceTokensComponent } from './balance.component';
import { TokenPipe } from '../../../../common/pipes/token.pipe';
import { TooltipComponentMock } from '../../../../mocks/common/components/tooltip/tooltip.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../../blockchain/contracts/token-contract.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MockService } from '../../../../utils/mock';

describe('WalletBalanceTokensComponent', () => {
  let comp: WalletBalanceTokensComponent;
  let fixture: ComponentFixture<WalletBalanceTokensComponent>;

  function getAddress(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `.m-wallet--balance--addresses .m-wallet--balance--addresses-address:nth-child(${i})`
      )
    );
  }

  function getAddressLabel(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `.m-wallet--balance--addresses .m-wallet--balance--addresses-address:nth-child(${i}) .m-wallet--balance--addresses-address-label span`
      )
    );
  }

  function getAddressAddress(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `.m-wallet--balance--addresses .m-wallet--balance--addresses-address:nth-child(${i}) span.m-wallet--balance--addresses-address-address`
      )
    );
  }

  function getAddressBalance(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `.m-wallet--balance--addresses .m-wallet--balance--addresses-address:nth-child(${i}) .m-wallet--balance--addresses-address-col span.m-wallet--balance--addresses-address-balance`
      )
    );
  }

  function getMetamaskDownload(): DebugElement {
    return fixture.debugElement.query(By.css(`.m-wallet--balance--metamask`));
  }

  const Web3WalletServiceMock = new (function() {
    this.getCurrentWallet = jasmine
      .createSpy('getCurrentWallet')
      .and.callFake(async () => {
        return '0xONCHAIN';
      });
    this.isLocal = jasmine
      .createSpy('getCurrentWallet')
      .and.callFake(async () => {
        return false;
      });
    this.getBalance = jasmine.createSpy('getBalance').and.callFake(async () => {
      return 0;
    });
  })();

  const Web3WalletLocalServiceMock = new (function() {
    this.getCurrentWallet = jasmine
      .createSpy('getCurrentWallet')
      .and.callFake(async () => {
        return '0xONCHAIN';
      });
    this.isLocal = jasmine
      .createSpy('getCurrentWallet')
      .and.callFake(async () => {
        return true;
      });
  })();

  const TokenContractServiceMock = new (function() {
    this.balanceOf = jasmine.createSpy('balanceOf').and.callFake(async () => {
      return 30000000;
    });
  })();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        TokenPipe,
        TooltipComponentMock,
        WalletBalanceTokensComponent,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Web3WalletService, useValue: Web3WalletServiceMock },
        { provide: TokenContractService, useValue: TokenContractServiceMock },
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
    fixture = TestBed.createComponent(WalletBalanceTokensComponent);

    comp = fixture.componentInstance; // WalletBalanceTokensComponent test instance
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/wallet/balance`] = {
      status: 'success',
      balance: 301529,
      addresses: [
        {
          label: 'Receiver',
          address: '0xreceiver',
          balance: 9000000000000000000,
        },
        {
          label: 'OffChain',
          address: '0xoffchain',
          balance: 9000000000000000000,
        },
      ],
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

  it('should have three addresses', () => {
    //expect(getAddress(1)).not.toBeNull();
    expect(getAddress(2)).not.toBeNull();
    expect(getAddress(3)).not.toBeNull();
  });

  it('should have a receiver address', () => {
    expect(getAddressLabel(2).nativeElement.textContent).toContain('Receiver');
    expect(getAddressAddress(2).nativeElement.textContent).toContain(
      '0xreceiver'
    );
    expect(getAddressBalance(2).nativeElement.textContent).toContain('9');
  });

  it('should have an offchain address', () => {
    expect(getAddressLabel(3).nativeElement.textContent).toContain('OffChain');
    expect(getAddressAddress(3).nativeElement.textContent).toContain(
      '0xoffchain'
    );
    expect(getAddressBalance(3).nativeElement.textContent).toContain('9');
  });

  it('should have a metamask download', () => {
    expect(getMetamaskDownload()).not.toBeNull;
  });

  it('should not have a metamask download with a local wallet', () => {
    TestBed.overrideProvider(Web3WalletService, {
      useValue: Web3WalletLocalServiceMock,
    });
    expect(getMetamaskDownload()).toBeNull;
  });

  xit('should have an onchainaddress', () => {
    expect(getAddressLabel(1).nativeElement.textContent).toContain('OnChain');
    expect(getAddressAddress(1).nativeElement.textContent).toContain('0x123');
    expect(getAddressBalance(1).nativeElement.textContent).toContain('127');
  });
});
