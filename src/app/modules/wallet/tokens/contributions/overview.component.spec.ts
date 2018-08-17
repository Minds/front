import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Component, DebugElement, ChangeDetectorRef, Input, Output } from '@angular/core';
import { WalletTokenContributionsOverviewComponent } from './overview.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { TokenPipe } from '../../../../common/pipes/token.pipe';
import { TimediffPipe } from '../../../../common/pipes/timediff.pipe';
import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent, MockDirective, MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../tests/session-mock.spec';

describe('WalletTokenContributionsOverviewComponent', () => {

  let comp: WalletTokenContributionsOverviewComponent;
  let fixture: ComponentFixture<WalletTokenContributionsOverviewComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        WalletTokenContributionsOverviewComponent,
        TimediffPipe,
        TokenPipe
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Router, useValue: RouterTestingModule },
        { provide: Session, useValue: sessionMock },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WalletTokenContributionsOverviewComponent);
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/contributions/overview`] = {
      "status": "success",
      "nextPayout": 35478,
      "currentReward": "0",
      "yourContribution": 0,
      "totalNetworkContribution": 173525,
      "yourShare": 0
    };

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

  it('should show chart, next payout absent', fakeAsync (() => {
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/contributions/overview`] = {
      "status": "success",
      "currentReward": "0",
      "yourContribution": 0,
      "totalNetworkContribution": 173525,
      "yourShare": 0
    };

    comp = fixture.componentInstance;
    fixture.detectChanges();
    comp.load();
    comp.updateNextPayout();
    fixture.detectChanges();
    expect(comp.overview.nextPayout).toBe(35477)
    expect(fixture.debugElement.query(By.css(`.m-token-contributions--overview`))).not.toBeNull();
  }));

  it('should show chart', fakeAsync (() => {

    comp.load();
    comp.updateNextPayout();
    fixture.detectChanges();
    expect(comp.overview.nextPayout).toBe(35477)
    expect(fixture.debugElement.query(By.css(`.m-token-contributions--overview`))).not.toBeNull();
  }));

  it('should fail', fakeAsync (() => {
    clientMock.response[`api/v2/blockchain/contributions/overview`] = {
      "status": "error",
      "nextPayout": 35478,
      "currentReward": "0",
      "yourContribution": 0,
      "totalNetworkContribution": 173525,
      "yourShare": 0
    };

    comp = fixture.componentInstance;
    fixture.detectChanges();
    comp.load();
    comp.updateNextPayout();
    fixture.detectChanges();
    expect(comp.overview.nextPayout).toBe(35477)
    expect(fixture.debugElement.query(By.css(`.m-token-contributions--overview`))).not.toBeNull();
  }));

});
