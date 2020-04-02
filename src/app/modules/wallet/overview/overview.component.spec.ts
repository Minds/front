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
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { WalletOverviewComponent } from './overview.component';
import { TokenPipe } from '../../../common/pipes/token.pipe';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api/client';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';

import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { MindsBlogListResponse } from '../../../interfaces/responses';
import { ContextService } from '../../../services/context.service';
import { RouterTestingModule } from '@angular/router/testing';
import { WalletService } from '../../../services/wallet';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { By } from '@angular/platform-browser';
import { storageMock } from '../../../../tests/storage-mock.spec';
import { Storage } from '../../../services/storage';
import { sessionMock } from '../../../../tests/session-mock.spec';

let routerMock = { navigate: jasmine.createSpy('navigate') };

let WalletServiceMock: any = new (function() {
  this.getBalance = jasmine.createSpy('getBalance').and.callFake(async () => {
    return 2;
  });
})();

let blockchainService: any = new (function() {
  this.getBalance = jasmine.createSpy('getBalance').and.callFake(async () => {
    return 2;
  });
})();

describe('WalletOverviewComponent', () => {
  let comp: WalletOverviewComponent;
  let fixture: ComponentFixture<WalletOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TokenPipe,
        MockComponent({ selector: 'm-wire-console--overview' }),
        MockComponent({ selector: 'm-wallet--balance-usd' }),
        MockComponent({ selector: 'm-wallet--balance-rewards' }),
        MockComponent({ selector: 'm-wallet--balance-tokens' }),
        WalletOverviewComponent,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: WalletService, useValue: WalletServiceMock },
        { provide: BlockchainService, useValue: blockchainService },
        { provide: Router, useValue: RouterTestingModule },
        { provide: Session, useValue: sessionMock },
        { provide: Storage, useValue: storageMock },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'newsfeed' }]),
            params: of({ filter: 'trending' }),
          },
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WalletOverviewComponent);

    comp = fixture.componentInstance; // WalletBalanceTokensComponent test instance
    clientMock.response = {};
    clientMock.response[`api/v1/monetization/revenue/overview`] = {
      status: 'success',
      balance: 301529,
      total: {
        net: 1,
      },
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

  it('should have Wallet', fakeAsync(() => {
    tick();
    expect(
      fixture.debugElement.query(By.css(`.m-wallet--overview`))
    ).not.toBeNull();

    expect(
      fixture.debugElement.query(By.css(`.m-wallet--overview-balances`))
    ).not.toBeNull();
  }));
});
