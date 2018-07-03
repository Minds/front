import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostPublisherEarningsComponent } from './earnings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { MockComponent } from '../../../../utils/mock';
import { Client } from '../../../../services/api/client';

describe('BoostPublisherEarningsComponent', () => {

  let comp: BoostPublisherEarningsComponent;
  let fixture: ComponentFixture<BoostPublisherEarningsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'm-tooltip', template: '<ng-content></ng-content>', inputs: ['icon'] }),
        MockComponent({ selector: 'm-boost-publisher--ledger' }),
        BoostPublisherEarningsComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostPublisherEarningsComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};

    clientMock.response['api/v2/boost/sums'] = {
      sums: {
        total_count: 3,
        total_earnings: 200,

        token_earnings: 200,
        token_count: 3,

        usd_earnings: 0,
        usd_count: 0,

        points_earnings: 0,
        points_count: 0,
      }
    };

    comp.filter = 'earnings';

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }

  });

  it('should have an overview of the earnings, showing amount of boosts shown and total earned in tokens', () => {
    fixture.detectChanges();
    const overview = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview'));
    expect(overview).not.toBeNull();
    expect(overview.children.length).toBe(2);

    const amountSpan = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview .m-boost-publisher--earnings-overview--total:first-child span'));
    expect(amountSpan).not.toBeNull();
    expect(amountSpan.nativeElement.textContent).toContain('3');

    const amountLabel = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview .m-boost-publisher--earnings-overview--total:first-child label'));
    expect(amountLabel).not.toBeNull();
    expect(amountLabel.nativeElement.textContent).toContain('Shown');

    const amountTooltip = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview .m-boost-publisher--earnings-overview--total:first-child m-tooltip'));
    expect(amountTooltip).not.toBeNull();
    expect(amountTooltip.nativeElement.textContent).toContain('How many boosts you have shown in total');

    const earningsSpan = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview .m-boost-publisher--earnings-overview--total:last-child span'));
    expect(earningsSpan).not.toBeNull();
    expect(earningsSpan.nativeElement.textContent).toContain('200');

    const earningsLabel = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview .m-boost-publisher--earnings-overview--total:last-child label'));
    expect(earningsLabel).not.toBeNull();
    expect(earningsLabel.nativeElement.textContent).toContain('Earnings');

    const earningsTooltip = fixture.debugElement.query(By.css('.m-boost-publisher--earnings-overview .m-boost-publisher--earnings-overview--total:last-child m-tooltip'));
    expect(earningsTooltip).not.toBeNull();
    expect(earningsTooltip.nativeElement.textContent).toContain("How much you've earned (in tokens) in total from all the boosts you have shown");
  });

  it('should have a ledger', () => {
    expect(fixture.debugElement.query(By.css('.m-boost-publisher--earnings--ledger m-boost-publisher--ledger'))).not.toBeNull();
  });

});
