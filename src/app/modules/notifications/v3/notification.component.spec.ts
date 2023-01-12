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
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { BoostLocation } from '../../boost/modal-v2/boost-modal-v2.types';

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
          {
            provide: DynamicBoostExperimentService,
            useValue: MockService(DynamicBoostExperimentService),
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

    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(true);

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

  // verb

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
  // pronoun

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

  // noun

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

  // nounLink

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

  it('should get correct nounLink for boost_accepted when experiment is on', () => {
    comp.notification = {
      type: 'boost_accepted',
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(true);
    expect(comp.nounLink).toEqual(['/boost/boost-console']);
  });

  it('should get correct nounLink for boost_accepted when experiment is off', () => {
    comp.notification = {
      type: 'boost_accepted',
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(false);
    expect(comp.nounLink).toEqual(['/boost/console/newsfeed/history']);
  });

  it('should get correct nounLink for boost_completed when experiment is on', () => {
    comp.notification = {
      type: 'boost_completed',
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(true);
    expect(comp.nounLink).toEqual(['/boost/boost-console']);
  });

  it('should get correct nounLink for boost_completed when experiment is off', () => {
    comp.notification = {
      type: 'boost_completed',
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(false);
    expect(comp.nounLink).toEqual(['/boost/console/newsfeed/history']);
  });

  it('should get correct nounLink for boost_rejected for channels', () => {
    const username: string = 'testuser';
    comp.notification = {
      type: 'boost_rejected',
      entity: {
        entity: {
          type: 'user',
          username: username,
        },
      },
    };
    expect(comp.nounLink).toEqual(['/' + username]);
  });

  it('should get correct nounLink for boost_rejected for activities', () => {
    const guid: string = '12345';
    comp.notification = {
      type: 'boost_rejected',
      entity: {
        entity: {
          type: 'activity',
          guid: guid,
        },
      },
    };
    expect(comp.nounLink).toEqual(['/newsfeed/' + guid]);
  });

  // nounLinkParams

  it('should get correct nounLinkParams for boost_accepted when experiment is off', () => {
    comp.notification = {
      type: 'boost_accepted',
      entity: {
        target_location: BoostLocation.NEWSFEED,
      },
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(false);
    expect(comp.nounLinkParams).toEqual(null);
  });

  it('should get correct nounLinkParams for boost_completed when experiment is off', () => {
    comp.notification = {
      type: 'boost_completed',
      entity: {
        target_location: BoostLocation.NEWSFEED,
      },
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(false);
    expect(comp.nounLinkParams).toEqual(null);
  });

  it('should get correct nounLinkParams for boost_accepted when experiment is on', () => {
    comp.notification = {
      type: 'boost_accepted',
      entity: {
        target_location: BoostLocation.SIDEBAR,
      },
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(true);
    expect(comp.nounLinkParams).toEqual({
      state: 'approved',
      location: 'sidebar',
    });
  });

  it('should get correct nounLinkParams for boost_completed when experiment is on', () => {
    comp.notification = {
      type: 'boost_completed',
      entity: {
        target_location: BoostLocation.NEWSFEED,
      },
    };
    (comp as any).dynamicBoostExperiment.isActive.and.returnValue(true);
    expect(comp.nounLinkParams).toEqual({
      state: 'completed',
      location: 'newsfeed',
    });
  });
});
