import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, ChangeDetectorRef } from '@angular/core';
import { WalletTokenContributionsChartComponent } from './chart.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import { Router } from '@angular/router';
import { Session } from '../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../tests/session-mock.spec';

describe('WalletTokenContributionsChartComponent', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletTokenContributionsChartComponent,
        TestHostComponent
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
    fixture = TestBed.createComponent(TestHostComponent);

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

  @Component({
    selector: `host-component`,
    template: `<m-wallet-token--chart [contributionValues]=this.contributionValues></m-wallet-token--chart>`
  })
  class TestHostComponent {
    contributionValues = {
      comments: 2,
      reminds: 4,
      votes: 1,
      subscribers: 4,
      referrals: 50,
      referrals_welcome: 50,
      checkin: 2,
      jury_duty: 25
    };
  }
});
