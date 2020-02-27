///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Client } from '../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../tests/client-mock.spec';
import { notificationServiceMock } from '../../../tests/notification-service-mock.spec';
import { MaterialMock } from '../../../tests/material-mock.spec';
import { NotificationComponent } from './notification.component';

import { TokenPipe } from '../../common/pipes/token.pipe';
import { Session } from '../../services/session';
import { Mock, MockComponent, MockService } from '../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { sessionMock } from '../../../tests/session-mock.spec';

import { ExcerptPipe } from '../../common/pipes/excerpt';
import { ConfigsService } from '../../common/services/configs.service';
import { FriendlyDateDiffPipe } from '../../common/pipes/friendlydatediff';
import { TimeDiffService } from '../../services/timediff.service';

describe('NotificationComponent', () => {
  let comp: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        FriendlyDateDiffPipe,
        NotificationComponent,
        TokenPipe,
        ExcerptPipe,
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: TimeDiffService, useValue: MockService(TimeDiffService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(NotificationComponent);
    comp = fixture.componentInstance;
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'group_activity',
      entityObj: {
        title: 'aaaaaaaaaaa',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        group: {},
        time_created: 2222,
        bid: 10,
      },
    };
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

  it('Should load the notification', () => {
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('name');
  });

  it('Should load the notification queue add', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'group_queue_add',
      entityObj: {
        title: 'aaaaaaaaaaa',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        group: {
          name: 'groupName',
        },
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('groupName');
  });

  it('Should load the notification queue approve', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'group_queue_approve',
      entityObj: {
        title: 'aaaaaaaaaaa',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        group: {
          name: 'groupName',
        },
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('groupName');
  });

  it('Should load the notification queue reject', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'group_queue_reject',
      entityObj: {
        title: 'aaaaaaaaaaa',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        group: {
          name: 'groupName',
        },
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('groupName');
  });

  it('Should load the notification remind', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'remind',
      entityObj: {
        type: 'object',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Title');
  });

  it('Should load the notification remind, without title', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'remind',
      entityObj: {
        type: 'object',
        subtype: 'object',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('your object');
  });

  it('Should load the notification feature, with title', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'feature',
      entityObj: {
        type: 'comment',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Title');
  });

  it('Should load the notification tag', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'tag',
      entityObj: {
        type: 'something',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      'name tagged you in a post'
    );
  });

  it('Should load the notification tag', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'tag',
      entityObj: {
        type: 'comment',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
        parent: {
          guid: 123,
        },
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      'name tagged you in a comment'
    );
  });

  it('Should load the notification boost_submitted', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'boost_submitted',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Title');
  });

  it('Should load the notification boost_submitted', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'boost_submitted',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Title');
  });

  it('Should load the notification boost_submitted_p2p', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'boost_submitted_p2p',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Title');
  });

  it('Should load the notification boost_request', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'boost_request',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Title');
  });

  it('Should load the notification channel_monetized', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'channel_monetized',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        bid: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      '<!---->Your channel is now monetized. Congratulations!'
    );
  });

  it('Should load the notification payout_accepted', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'payout_accepted',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        amount: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      '<!---->Your payment request for $10.00 was approved.'
    );
  });

  it('Should load the notification payout_declined', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'payout_declined',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        amount: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      '<!---->Your payment request for $10.00 was declined.'
    );
  });

  it('Should load the notification rewards summary', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'rewards_summary',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        amount: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      'You earned 10 tokens today.'
    );
  });

  it('Should load the notification rewards reminder', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'rewards_reminder',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        left: 'some time',
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      'You have some time left to earn tokens today!'
    );
  });

  it('Should load the notification welcome_boost', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'welcome_boost',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        amount: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toContain(
      'You can gain more reach by boosting your content. Hit the blue boost icon on your posts.'
    );
  });

  it('Should load the notification welcome_discover', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'welcome_discover',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        amount: 10,
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('span.pseudo-link'));
    expect(notification.nativeElement.innerHTML).toBe('Tap here');
  });

  it('Should load the notification custom_message', () => {
    comp.notification = {
      type: 'notification',
      guid: '843204301747658770',
      notification_view: 'custom_message',
      entityObj: {
        type: 'activity',
        title: 'Title',
      },
      fromObj: {
        name: 'name',
      },
      params: {
        time_created: 2222,
        amount: 10,
        message: 'this is a mesage',
      },
    };
    fixture.detectChanges();
    expect(comp.notification).not.toBeNull();
    const notification = fixture.debugElement.query(By.css('p'));
    expect(notification.nativeElement.innerHTML).toBe('this is a mesage');
  });
});
