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
});