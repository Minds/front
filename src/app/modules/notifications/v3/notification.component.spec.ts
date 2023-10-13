import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NotificationsV3Service } from './notifications-v3.service';
import { ActivityService } from '../../newsfeed/activity/activity.service';
import { Session } from '../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsV3NotificationComponent } from './notification.component';
import { MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { InteractionsModalService } from '../../newsfeed/interactions-modal/interactions-modal.service';
import { GiftCardProductIdEnum } from '../../../../graphql/generated.engine';

describe('NotificationsV3NotificationComponent', () => {
  let comp: NotificationsV3NotificationComponent;
  let fixture: ComponentFixture<NotificationsV3NotificationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [NotificationsV3NotificationComponent],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
          {
            provide: ElementRef,
            useValue: MockService(ElementRef),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: InteractionsModalService,
            useValue: MockService(InteractionsModalService),
          },
        ],
      })
        .overrideProvider(NotificationsV3Service, {
          useValue: MockService(NotificationsV3Service),
        })
        .overrideProvider(ActivityService, {
          useValue: MockService(ActivityService),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(NotificationsV3NotificationComponent);
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

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  describe('verb', () => {
    it('should get correct verb for supermind_accepted', () => {
      comp.notification = { type: 'supermind_accepted' };
      expect(comp.verb).toBe(' has replied to');
    });

    it('should get correct verb for supermind_created', () => {
      comp.notification = { type: 'supermind_created' };
      expect(comp.verb).toBe(' sent you');
    });

    it('should get correct verb for supermind_rejected', () => {
      comp.notification = { type: 'supermind_rejected' };
      expect(comp.verb).toBe(' has declined');
    });

    it('should get correct verb for boost_accepted', () => {
      comp.notification = { type: 'boost_accepted' };
      expect(comp.verb).toBe('Your Boost is now running');
    });

    it('should get correct verb for boost_rejected', () => {
      comp.notification = { type: 'boost_rejected' };
      expect(comp.verb).toBe('Your Boost was rejected');
    });

    it('should get correct verb for boost_completed', () => {
      comp.notification = { type: 'boost_completed' };
      expect(comp.verb).toBe('Your Boost is complete');
    });

    it('should get correct verb for group_queue_received', () => {
      comp.notification = { type: 'group_queue_received' };
      expect(comp.verb).toBe('Post pending approval in');
    });

    it('should get correct verb for gift_card_recipient_notified', () => {
      comp.notification = { type: 'gift_card_recipient_notified' };
      expect(comp.verb).toBe('sent');
    });

    it('should get correct verb for gift_card_claimed_issuer_notified', () => {
      comp.notification = { type: 'gift_card_claimed_issuer_notified' };
      expect(comp.verb).toBe('claimed');
    });
  });

  describe('pronoun', () => {
    it('should get correct pronoun for supermind_accepted', () => {
      comp.notification = { type: 'supermind_accepted' };
      expect(comp.pronoun).toBe('your');
    });

    it('should get correct pronoun for supermind_created', () => {
      comp.notification = { type: 'supermind_created' };
      expect(comp.pronoun).toBe('a');
    });

    it('should get correct pronoun for supermind_rejected', () => {
      comp.notification = { type: 'supermind_rejected' };
      expect(comp.pronoun).toBe('your');
    });

    it('should get correct pronoun for boost_accepted', () => {
      comp.notification = { type: 'boost_accepted' };
      expect(comp.pronoun).toBe('');
    });

    it('should get correct pronoun for boost_rejected', () => {
      comp.notification = { type: 'boost_rejected' };
      expect(comp.pronoun).toBe('');
    });

    it('should get correct pronoun for boost_completed', () => {
      comp.notification = { type: 'boost_completed' };
      expect(comp.pronoun).toBe('');
    });

    it('should get correct pronoun for group_queue_received', () => {
      comp.notification = { type: 'group_queue_received' };
      expect(comp.pronoun).toBe('');
    });

    it('should get correct pronoun for gift_card_recipient_notified', () => {
      comp.notification = { type: 'gift_card_recipient_notified' };
      expect(comp.pronoun).toBe('you');
    });

    it('should get correct pronoun for gift_card_claimed_issuer_notified', () => {
      comp.notification = { type: 'gift_card_claimed_issuer_notified' };
      expect(comp.pronoun).toBe('your');
    });
  });

  describe('noun', () => {
    it('should get correct noun for supermind_accepted', () => {
      comp.notification = { type: 'supermind_accepted' };
      expect(comp.noun).toBe('Supermind offer');
    });

    it('should get correct noun for supermind_created', () => {
      comp.notification = { type: 'supermind_created' };
      expect(comp.noun).toBe('Supermind offer');
    });

    it('should get correct noun for supermind_rejected', () => {
      comp.notification = { type: 'supermind_rejected' };
      expect(comp.noun).toBe('Supermind offer');
    });

    it('should get correct noun for boost_accepted', () => {
      comp.notification = { type: 'boost_accepted' };
      expect(comp.noun).toBe('');
    });

    it('should get correct noun for boost_rejected', () => {
      comp.notification = { type: 'boost_rejected' };
      expect(comp.noun).toBe('');
    });

    it('should get correct noun for boost_completed', () => {
      comp.notification = { type: 'boost_completed' };
      expect(comp.noun).toBe('');
    });

    it('should get correct noun for group_queue_received', () => {
      const groupName: string = 'My group with a long truncated name';
      comp.notification = {
        type: 'group_queue_received',
        entity: {
          name: groupName,
        },
      };

      expect(comp.noun).toBe('My group with a long trunca...');
    });

    it('should get correct noun for gift_card_recipient_notified for Boost', () => {
      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          gift_card: {
            productId: 0,
          },
        },
      };
      expect(comp.noun).toBe('a gift for Boost');
    });

    it('should get correct noun for gift_card_recipient_notified for Plus', () => {
      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          gift_card: {
            productId: 1,
          },
        },
      };
      expect(comp.noun).toBe('a gift for Minds+');
    });

    it('should get correct noun for gift_card_recipient_notified for Pro', () => {
      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          gift_card: {
            productId: 2,
          },
        },
      };
      expect(comp.noun).toBe('a gift for Minds Pro');
    });

    it('should get correct noun for gift_card_recipient_notified for Supermind', () => {
      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          gift_card: {
            productId: 3,
          },
        },
      };
      expect(comp.noun).toBe('a gift for Supermind');
    });

    it('should get correct noun for gift_card_claimed_issuer_notified for Boost', () => {
      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
        data: {
          gift_card: {
            productId: 0,
          },
        },
      };
      expect(comp.noun).toBe('gift for Boost');
    });

    it('should get correct noun for gift_card_claimed_issuer_notified for Plus', () => {
      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
        data: {
          gift_card: {
            productId: 1,
          },
        },
      };
      expect(comp.noun).toBe('gift for Minds+');
    });

    it('should get correct noun for gift_card_claimed_issuer_notified for Pro', () => {
      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
        data: {
          gift_card: {
            productId: 2,
          },
        },
      };
      expect(comp.noun).toBe('gift for Minds Pro');
    });

    it('should get correct noun for gift_card_claimed_issuer_notified for Supermind', () => {
      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
        data: {
          gift_card: {
            productId: 3,
          },
        },
      };
      expect(comp.noun).toBe('gift for Supermind');
    });
  });

  describe('nounLink', () => {
    it('should get correct nounLink for supermind_accepted', () => {
      comp.notification = {
        type: 'supermind_accepted',
        entity: {
          reply_activity_guid: '123',
        },
      };
      expect(comp.nounLink).toEqual(['/newsfeed', '123']);
    });

    it('should get correct nounLink for supermind_created', () => {
      comp.notification = {
        type: 'supermind_created',
        entity: {
          guid: '123',
        },
      };
      expect(comp.nounLink).toEqual(['/supermind/123']);
    });

    it('should get correct nounLink for supermind_rejected', () => {
      comp.notification = {
        type: 'supermind_rejected',
        entity: {
          guid: '123',
        },
      };
      expect(comp.nounLink).toEqual(['/supermind/123']);
    });

    it('should get correct nounLink for boost_accepted', () => {
      comp.notification = {
        type: 'boost_accepted',
      };
      expect(comp.nounLink).toEqual(['/boost/boost-console']);
    });

    it('should get correct nounLink for boost_completed', () => {
      comp.notification = {
        type: 'boost_completed',
      };
      expect(comp.nounLink).toEqual(['/boost/boost-console']);
    });

    it('should get correct nounLink for boost_rejected', () => {
      comp.notification = {
        type: 'boost_rejected',
      };
      expect(comp.nounLink).toEqual(['/boost/boost-console']);
    });

    it('should get correct nounLink for group_queue_received', () => {
      const guid: string = '1234567890123456';
      comp.notification = {
        type: 'group_queue_received',
        entity: {
          guid: guid,
        },
      };
      expect(comp.nounLink).toEqual([`/group/${guid}/review`]);
    });

    it('should get correct nounLink for gift_card_recipient_notified', () => {
      const claimCode: string = 'testClaimCode';
      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          gift_card: {
            claimCode: claimCode,
          },
        },
      };
      expect(comp.nounLink).toEqual(['/gift-cards/claim/', claimCode]);
    });

    it('should get correct nounLink for gift_card_claimed_issuer_notified', () => {
      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
      };
      expect(comp.nounLink).toEqual(['/settings/payments/payment-history']);
    });
  });

  describe('nounLinkParams', () => {
    it('should get correct nounLinkParams for boost_accepted', () => {
      comp.notification = {
        type: 'boost_accepted',
        entity: {
          guid: '789',
        },
      };
      expect(comp.nounLinkParams).toEqual({
        boostGuid: '789',
      });
    });

    it('should get correct nounLinkParams for boost_completed', () => {
      comp.notification = {
        type: 'boost_completed',
        entity: {
          guid: '789',
        },
      };
      expect(comp.nounLinkParams).toEqual({
        boostGuid: '789',
      });
    });

    it('should get correct nounLinkParams for boost_rejected', () => {
      comp.notification = {
        type: 'boost_rejected',
        entity: {
          guid: '789',
        },
      };
      expect(comp.nounLinkParams).toEqual({
        boostGuid: '789',
      });
    });
  });

  describe('getNotificationSenderDetails', () => {
    it('should get correct notificationSenderDetails for gift_card_recipient_notified', () => {
      const name: string = 'testAccountName';
      const username: string = 'testAccountUsername';

      (comp as any).senderDetails = null;

      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          sender: {
            username: username,
            name: name,
          },
        },
        from: { guid: '123' },
      };

      expect(comp.getNotificationSenderDetails()).toEqual(
        new Map<string, any>([
          ['username', username],
          ['name', name],
          ['avatarUrl', jasmine.any(String)],
        ])
      );
    });

    it('should get correct notificationSenderDetails for gift_card_recipient_notified and truncate long names', () => {
      const name: string = 'testAccountNameThatIsLong';
      const username: string = 'testAccountUsername';

      (comp as any).senderDetails = null;

      comp.notification = {
        type: 'gift_card_recipient_notified',
        data: {
          sender: {
            username: username,
            name: name,
          },
        },
        from: { guid: '123' },
      };

      expect(comp.getNotificationSenderDetails()).toEqual(
        new Map<string, any>([
          ['username', username],
          ['name', 'testAccountNameTh...'],
          ['avatarUrl', jasmine.any(String)],
        ])
      );
    });

    it('should get correct notificationSenderDetails for gift_card_claimed_issuer_notified', () => {
      const name: string = 'testAccountName';
      const username: string = 'testAccountUsername';

      (comp as any).senderDetails = null;

      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
        data: {
          claimant: {
            username: username,
            name: name,
          },
        },
        from: { guid: '123' },
      };

      expect(comp.getNotificationSenderDetails()).toEqual(
        new Map<string, any>([
          ['username', username],
          ['name', name],
          ['avatarUrl', jasmine.any(String)],
        ])
      );
    });

    it('should get correct notificationSenderDetails for gift_card_claimed_issuer_notified and truncate long names', () => {
      const name: string = 'testAccountNameThatIsLong';
      const username: string = 'testAccountUsername';

      (comp as any).senderDetails = null;

      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
        data: {
          claimant: {
            username: username,
            name: name,
          },
        },
        from: { guid: '123' },
      };

      expect(comp.getNotificationSenderDetails()).toEqual(
        new Map<string, any>([
          ['username', username],
          ['name', 'testAccountNameTh...'],
          ['avatarUrl', jasmine.any(String)],
        ])
      );
    });
  });

  describe('typeBubbleTag', () => {
    it('should get correct typeBubbleTag for gift_card_recipient_notified', () => {
      comp.notification = {
        type: 'gift_card_recipient_notified',
      };
      expect(comp.typeBubbleTag).toBe('redeem');
    });

    it('should get correct typeBubbleTag for gift_card_claimed_issuer_notified', () => {
      comp.notification = {
        type: 'gift_card_claimed_issuer_notified',
      };
      expect(comp.typeBubbleTag).toBe('redeem');
    });
  });
});
