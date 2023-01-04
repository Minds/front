import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../../../utils/mock';
import { Supermind } from '../../../supermind.types';
import { SupermindConsoleListItemComponent } from './list-item.component';
import { Session } from '../../../../../services/session';

describe('SupermindConsoleListItemComponent', () => {
  let comp: SupermindConsoleListItemComponent;
  let fixture: ComponentFixture<SupermindConsoleListItemComponent>;

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
        declarations: [
          SupermindConsoleListItemComponent,
          MockComponent({
            selector: 'm-chipBadge',
          }),
          MockComponent({
            selector: 'm-activity',
            inputs: [
              'entity',
              'canDelete',
              'displayOptions',
              'autoplayVideo',
              'canRecordAnalytics',
            ],
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['size'],
          }),
          MockComponent({
            selector: 'm-supermind__stateLabel',
            inputs: ['supermind'],
          }),
          MockComponent({
            selector: 'm-supermind__actionButtons',
            inputs: ['supermind'],
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SupermindConsoleListItemComponent);
    comp = fixture.componentInstance;

    comp.supermind = mockSupermind;
    comp.context = 'inbox';

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

  it('should get badge text when payment type is cash', () => {
    comp.supermind.payment_method = 0;
    comp.supermind.payment_amount = 10;

    expect(comp.amountBadgeText).toBe(`\$10 Offer`);
  });

  it('should get badge text when payment type is token', () => {
    comp.supermind.payment_method = 1;
    comp.supermind.payment_amount = 10;

    expect(comp.amountBadgeText).toBe(`10 Token Offer`);
  });

  it('should get badge text as empty when payment type is unsupported', () => {
    comp.supermind.payment_method = 3;
    comp.supermind.payment_amount = 10;

    expect(comp.amountBadgeText).toBe('');
  });

  it('should get requirements text when reply type is text', () => {
    comp.supermind.reply_type = 0;
    comp.supermind.twitter_required = false;

    expect(comp.requirementsText).toBe('Text Reply');
  });

  it('should get requirements text when reply type is image', () => {
    comp.supermind.reply_type = 1;
    comp.supermind.twitter_required = false;

    expect(comp.requirementsText).toBe('Image Reply');
  });

  it('should get requirements text when reply type is video', () => {
    comp.supermind.reply_type = 2;
    comp.supermind.twitter_required = false;

    expect(comp.requirementsText).toBe('Video Reply');
  });

  it('should get requirements text when reply type is text when twitter is required', () => {
    comp.supermind.reply_type = 0;
    comp.supermind.twitter_required = true;

    expect(comp.requirementsText).toBe('Text Reply · Twitter');
  });

  it('should get requirements text when reply type is image when twitter is required', () => {
    comp.supermind.reply_type = 1;
    comp.supermind.twitter_required = true;

    expect(comp.requirementsText).toBe('Image Reply · Twitter');
  });

  it('should get requirements text when reply type is video when twitter is required', () => {
    comp.supermind.reply_type = 2;
    comp.supermind.twitter_required = true;

    expect(comp.requirementsText).toBe('Video Reply · Twitter');
  });
});
