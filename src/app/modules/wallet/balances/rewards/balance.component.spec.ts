import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { WalletBalanceRewardsComponent } from './balance.component';
import { TokenPipe } from '../../../../common/pipes/token.pipe';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../../blockchain/contracts/token-contract.service';
import { By } from '@angular/platform-browser';

describe('WalletBalanceRewardsComponent', () => {

  let comp: WalletBalanceRewardsComponent;
  let fixture: ComponentFixture<WalletBalanceRewardsComponent>;

  function getBalance(): DebugElement {
    return fixture.debugElement.query(By.css(`.m-wallet--balance`));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        TokenPipe,
        WalletBalanceRewardsComponent
      ],
      providers: [
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WalletBalanceRewardsComponent);

    comp = fixture.componentInstance; // WalletBalanceTokensComponent test instance
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/rewards/balance`] = {
      'status': 'success',
      'balance': 301529,
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

  it('should have balance', () => {
    expect(getBalance()).not.toBeNull();
  });

});
