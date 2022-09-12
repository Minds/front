import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { clientMock } from '../../../../../../tests/client-mock.spec';
import { ApiService } from '../../../../../common/api/api.service';
import { EmailConfirmationService } from '../../../../../common/components/email-confirmation/email-confirmation.service';
import { FriendlyDateDiffPipe } from '../../../../../common/pipes/friendlydatediff';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { Client } from '../../../../../services/api';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ComposerModalService } from '../../../../composer/components/modal/modal.service';
import { EmailCodeExperimentService } from '../../../../experiments/sub-services/email-code-experiment.service';
import { Supermind } from '../../../supermind.types';
import { SupermindConsoleListItemComponent } from './list-item.component';

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
            selector: 'm-blueFadeBadge',
            inputs: ['text'],
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
        ],
        providers: [
          FriendlyDateDiffPipe,
          ComposerModalService,
          ToasterService,
          {
            provide: EmailConfirmationService,
            useValue: MockService(EmailConfirmationService),
          },
          {
            provide: ApiService,
            useValue: MockService(ApiService),
          },
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

  it('should get time till expiration based on created_timestamp and expiry_threshold', () => {
    // arbitrary values to make checking addition easy.
    comp.supermind.created_timestamp = 1;
    comp.supermind.expiry_threshold = 2;

    // (comp as any).dataPipe.transform.and.returnValue('3');

    expect(comp.timeTillExpiration).toBe('3');
    expect((comp as any).dataPipe.transform).toHaveBeenCalledWith(
      3,
      null,
      false,
      true
    );
  });
});
