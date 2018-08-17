import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Component, DebugElement, ChangeDetectorRef, Input, Output } from '@angular/core';
import { WalletTokenContributionsChartComponent } from './chart.component';
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

describe('WalletTokenContributionsChartComponent', () => {

  let comp: WalletTokenContributionsChartComponent;
  let fixture: ComponentFixture<WalletTokenContributionsChartComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        WalletTokenContributionsChartComponent
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
    fixture = TestBed.createComponent(WalletTokenContributionsChartComponent);

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
    expect(fixture.debugElement.query(By.css(`.m-token-contributions--chart`))).not.toBeNull();
  }));
});
