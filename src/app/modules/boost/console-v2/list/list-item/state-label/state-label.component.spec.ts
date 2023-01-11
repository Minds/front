import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../../../../utils/mock';
import { Boost, BoostState } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';
import { BoostConsoleStateLabelComponent } from './state-label.component';
describe('BoostConsoleStateLabelComponent', () => {
  let comp: BoostConsoleStateLabelComponent;
  let fixture: ComponentFixture<BoostConsoleStateLabelComponent>;

  function getText(i: number = 0): DebugElement {
    return fixture.debugElement.query(By.css(`span`));
  }

  const mockBoost: Boost = {
    guid: '123',
    urn: 'boost:123',
    owner_guid: '345',
    entity_guid: '456',
    entity: { guid: '456' },
    boost_status: 1,
    payment_method: 1,
    payment_tx_id: '567',
    target_location: 1,
    target_suitability: 1,
    payment_amount: 1,
    daily_bid: 1,
    duration_days: 1,
    created_timestamp: 1662715004,
    updated_timestamp: 1662715004,
    approved_timestamp: null,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [BoostConsoleStateLabelComponent],
        providers: [
          {
            provide: BoostConsoleService,
            useValue: MockService(BoostConsoleService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostConsoleStateLabelComponent);
    comp = fixture.componentInstance;
    comp.boost = mockBoost;

    (comp as any).service.getTimeTillExpiration.calls.reset();

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should show pending if a boost is in a pending state', () => {
    comp.boost.boost_status = BoostState.PENDING;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Pending');
  });

  it('should show declined if a boost is in a rejected state', () => {
    comp.boost.boost_status = BoostState.REJECTED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Declined');
  });

  it('should show completed if a boost is in a completed state', () => {
    comp.boost.boost_status = BoostState.COMPLETED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Completed');
  });
});
