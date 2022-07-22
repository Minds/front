import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EnablePushNotificationsNoticeComponent } from './enable-push-notifications-notice.component';
import { Router } from '@angular/router';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ToasterService } from '../../../../common/services/toaster.service';
import { NotificationsSettingsV2Service } from '../../../settings-v2/account/notifications-v3/notifications-settings-v3.service';
import { of } from 'rxjs';

describe('EnablePushNotificationsNoticeComponent', () => {
  let comp: EnablePushNotificationsNoticeComponent;
  let fixture: ComponentFixture<EnablePushNotificationsNoticeComponent>;

  let routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          EnablePushNotificationsNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon'],
            outputs: ['dismissClick'],
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'solid', 'size'],
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: Router,
            useValue: routerMock,
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
          {
            provide: NotificationsSettingsV2Service,
            useValue: MockService(NotificationsSettingsV2Service),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(EnablePushNotificationsNoticeComponent);
    comp = fixture.componentInstance;
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to update settings on primary option click and alert and dismiss on success', () => {
    (comp as any).notificationSettings.togglePush.and.returnValue(
      of({
        enabled: true,
      })
    );

    comp.onPrimaryOptionClick(null);

    expect((comp as any).notificationSettings.togglePush).toHaveBeenCalledWith(
      'all',
      true
    );
    expect((comp as any).toast.success).toHaveBeenCalled();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'enable-push-notifications'
    );
  });

  it('should call to update settings on primary option click and alert on error', () => {
    (comp as any).notificationSettings.togglePush.and.returnValue(
      of({
        enabled: false,
      })
    );

    comp.onPrimaryOptionClick(null);

    expect((comp as any).notificationSettings.togglePush).toHaveBeenCalledWith(
      'all',
      true
    );
    expect((comp as any).toast.error).toHaveBeenCalled();
  });

  it('should navigate to push notification settings on secondary option click', () => {
    comp.onSecondaryOptionClick(null);
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/settings/account/push-notifications',
    ]);
  });

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'enable-push-notifications'
    );
  });
});
