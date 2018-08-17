import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Component, DebugElement, ChangeDetectorRef, Input, Output } from '@angular/core';
import { WalletTokenContributionsComponent } from './contributions.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';

import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent, MockDirective, MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../tests/session-mock.spec';

describe('WalletTokenContributionsComponent', () => {

  let comp: WalletTokenContributionsComponent;
  let fixture: ComponentFixture<WalletTokenContributionsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({ selector: 'm-wallet-token--overview'}),
        MockComponent({ selector: 'm-wallet-token--chart'}),
        MockComponent({ selector: 'm-date-selector', inputs: ['label', 'date', 'dateChange', 'dateFormat'] }),
        MockComponent({ selector: 'm-token--onboarding--rewards', inputs: ['skippable']}),
        WalletTokenContributionsComponent
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
    fixture = TestBed.createComponent(WalletTokenContributionsComponent);
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/contributions`] = {
      'status': 'success',
      'balance': 301529,
      contributions : [
        {
          "timestamp":1533081600000,
          "metrics":
            {"votes":
              {
                "metric":"votes",
                "timestamp":1533081600000,
                "amount":"1",
                "score":1,
                "user":"747562985026756623"
              }
            },
          "amount":1,
          "score":1,
          "share":0.0009832358291136129 
        },
        {
          "timestamp":1533081600000,
          "metrics":
            {"votes":
              {
                "metric":"votes",
                "timestamp":1533081600000,
                "amount":"1",
                "score":1,
                "user":"747562985026756623"
              }
            },
          "amount":1,
          "score":1,
          "share":0.0009832358291136129 
        },
        {
          "timestamp":1533081600000,
          "metrics":
            {"votes":
              {
                "metric":"votes",
                "timestamp":1533081600000,
                "amount":"1",
                "score":1,
                "user":"747562985026756623"
              }
            },
          "amount":1,
          "score":1,
          "share":0.0009832358291136129 
        }
      ]
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

  it('should show chart', fakeAsync (() => {
    comp.inProgress = true;

    comp.load(false);

    comp.inProgress = false;

    comp.load(true);

    expect(fixture.debugElement.query(By.css(`.m-token-contributions--ledger`))).not.toBeNull();
  }));


  it('should show chart', fakeAsync (() => {
    expect(fixture.debugElement.query(By.css(`.m-token-contributions--ledger`))).not.toBeNull();

    comp.onEndDateChange('a/b/c');

    comp.onStartDateChange('a/b/c');
    tick();
    fixture.detectChanges();
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe('api/v2/blockchain/contributions');
    expect(fixture.debugElement.queryAll(By.css(`.m-token-contributions--ledger-row`)).length).toBe(6);
  }));

  it('should show chart, but no data', fakeAsync (() => {
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/contributions`] = {};

    comp = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css(`.m-token-contributions--ledger`))).not.toBeNull();

    comp.onEndDateChange('a/b/c');

    comp.onStartDateChange('a/b/c');
    tick();
    fixture.detectChanges();
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe('api/v2/blockchain/contributions');
  }));
});
