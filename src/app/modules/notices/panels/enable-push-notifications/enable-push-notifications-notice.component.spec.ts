import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EnablePushNotificationsNoticeComponent } from './enable-push-notifications-notice.component';
import { Router } from '@angular/router';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../../../../common/api/api.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
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
            provide: ApiService,
            useValue: MockService(ApiService),
          },
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
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

  it('should call API to update settings on primary option click and alert and dismiss on success', () => {
    (comp as any).api.post.and.returnValue(
      of({
        enabled: true,
      })
    );

    comp.onPrimaryOptionClick(null);

    expect((comp as any).api.post).toHaveBeenCalledWith(
      'api/v3/notifications/push/settings/all',
      {
        enabled: true,
      }
    );

    expect((comp as any).toast.success).toHaveBeenCalledWith(
      'Enabled push notifications'
    );
    expect((comp as any).feedNotice.setDismissed).toHaveBeenCalledWith(
      'enable-push-notifications',
      true
    );
  });

  it('should call API to update settings on primary option click and alert on error', () => {
    (comp as any).api.post.and.returnValue(
      of({
        status: 'failed',
      })
    );

    comp.onPrimaryOptionClick(null);

    expect((comp as any).api.post).toHaveBeenCalledWith(
      'api/v3/notifications/push/settings/all',
      {
        enabled: true,
      }
    );

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'Unable to save push notification settings'
    );
  });

  it('should navigate to push notification settings on secondary option click', () => {
    comp.onSecondaryOptionClick(null);
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/settings/account/push-notifications',
    ]);
  });

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.setDismissed).toHaveBeenCalledWith(
      'enable-push-notifications',
      true
    );
  });
});
