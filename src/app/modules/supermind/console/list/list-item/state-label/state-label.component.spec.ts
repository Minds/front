import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../../../../utils/mock';
import { Supermind, SupermindState } from '../../../../supermind.types';
import { SupermindConsoleExpirationService } from '../../../services/supermind-expiration.service';
import { SupermindConsoleStateLabelComponent } from './state-label.component';

describe('SupermindConsoleStateLabelComponent', () => {
  let comp: SupermindConsoleStateLabelComponent;
  let fixture: ComponentFixture<SupermindConsoleStateLabelComponent>;

  function getText(i: number = 0): DebugElement {
    return fixture.debugElement.query(By.css(`span`));
  }

  const mockSupermind: Supermind = {
    guid: '123',
    activity_guid: '234',
    sender_guid: '345',
    receiver_guid: '456',
    status: 1,
    payment_amount: 1,
    payment_method: 1,
    payment_txid: '567',
    created_timestamp: 1662715004,
    updated_timestamp: 1662715004,
    expiry_threshold: 604800,
    twitter_required: true,
    reply_type: 1,
    entity: { guid: '123' },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SupermindConsoleStateLabelComponent],
        providers: [
          {
            provide: SupermindConsoleExpirationService,
            useValue: MockService(SupermindConsoleExpirationService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SupermindConsoleStateLabelComponent);
    comp = fixture.componentInstance;
    comp.supermind = mockSupermind;

    (comp as any).expirationService.getTimeTillExpiration.calls.reset();

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

  it('should get time till expiration from service', () => {
    const timeString: string = '4h';
    (comp as any).expirationService.getTimeTillExpiration.and.returnValue(
      timeString
    );
    expect(comp.timeTillExpiration).toBe(timeString);
    expect(
      (comp as any).expirationService.getTimeTillExpiration
    ).toHaveBeenCalled();
  });

  it('should show pending if a supermind is in a pending state', () => {
    comp.supermind.status = SupermindState.PENDING;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Pending');
  });

  it('should show expiration time if a supermind is in a created state and time is not elapsed', () => {
    comp.supermind.status = SupermindState.CREATED;
    const timeString: string = '4h';
    (comp as any).expirationService.getTimeTillExpiration.and.returnValue(
      timeString
    );

    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe(
      `Expires: ${timeString}`
    );
  });

  it('should show expired if a supermind is in a created state and time is elapsed', () => {
    comp.supermind.status = SupermindState.CREATED;
    const timeString: string = null;
    (comp as any).expirationService.getTimeTillExpiration.and.returnValue(
      timeString
    );

    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Expired');
  });

  it('should show accepted if a supermind is in a accepted state', () => {
    comp.supermind.status = SupermindState.ACCEPTED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Accepted');
  });

  it('should show revoked if a supermind is in a revoked state', () => {
    comp.supermind.status = SupermindState.REVOKED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Revoked');
  });

  it('should show declined if a supermind is in a rejected state', () => {
    comp.supermind.status = SupermindState.REJECTED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Declined');
  });

  it('should show payment failed if a supermind is in a failed payment state', () => {
    comp.supermind.status = SupermindState.FAILED_PAYMENT;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Payment Failed');
  });

  it('should show unknown error if a supermind is in a failed state', () => {
    comp.supermind.status = SupermindState.FAILED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Unknown Error');
  });

  it('should show expired if a supermind is in an expired state', () => {
    comp.supermind.status = SupermindState.EXPIRED;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('Expired');
  });

  it('should show expired if a supermind is in an expired state', () => {
    comp.supermind.status = 999;
    fixture.detectChanges();
    expect(getText().nativeElement.textContent.trim()).toBe('State Unknown');
  });
});
