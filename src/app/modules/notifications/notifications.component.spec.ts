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
import { NotificationsComponent } from './notifications.component';

import { NotificationService } from './notification.service';
import { Session } from '../../services/session';
import { Mock, MockComponent, MockService } from '../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { sessionMock } from '../../../tests/session-mock.spec';
import { ConfigsService } from '../../common/services/configs.service';
import { TimeDiffService } from '../../services/timediff.service';
import { FriendlyDateDiffPipe } from '../../common/pipes/friendlydatediff';

describe('NotificationsComponent', () => {
  let comp: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        NotificationsComponent,
        MockComponent({
          selector: 'minds-notification',
          inputs: ['notification', 'showElapsedTime'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress', 'scrollSource'],
        }),
        MockComponent({
          selector: 'm-tooltip',
        }),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(NotificationsComponent);
    clientMock.response = {};

    clientMock.response[`api/v1/notifications/all`] = {
      status: 'success',
      notifications: [
        {
          type: 'notification',
          guid: '843204301747658770',
          notification_view: 'group_activity',
        },
        {
          type: 'notification',
          guid: '843204301747658770',
          notification_view: 'group_activity',
        },
        {
          type: 'notification',
          guid: '843204301747658770',
          notification_view: 'group_activity',
        },
      ],
    };
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

  it('Should load 3 elements', () => {
    fixture.detectChanges();
    expect(comp.notifications.length).toBe(3);
    const notifications = fixture.debugElement.queryAll(
      By.css('minds-notification')
    );
    expect(notifications.length).toBe(3);
  });

  it('Should show the filters with tooltips', () => {
    fixture.detectChanges();
    const tooltips = fixture.debugElement.queryAll(By.css('m-tooltip'));
    expect(tooltips.length).toBe(6);
  });

  it('infinite scroll shouldnt be visible if visible false', () => {
    comp.visible = false;
    fixture.detectChanges();
    const notifications = fixture.debugElement.query(By.css('infinite-scroll'));
    expect(notifications).toBeNull();
  });

  it('infinite load on click', () => {
    comp.notificationService.count = 1;
    fixture.detectChanges();
    const notifications = fixture.debugElement.query(
      By.css('.m-notifications--load-new a')
    );
    notifications.nativeElement.click();
    fixture.detectChanges();

    const call = clientMock.get.calls.mostRecent();
    expect(call.args[0]).toBe('api/v1/notifications/all');
  });

  it('should load notifications using the proper endpoint', () => {
    fixture.detectChanges();
    const call = clientMock.get.calls.mostRecent();
    expect(call.args[0]).toBe('api/v1/notifications/all');
    const notifications = fixture.debugElement.queryAll(
      By.css('minds-notification')
    );
    expect(notifications.length).toBe(3);
  });
});
