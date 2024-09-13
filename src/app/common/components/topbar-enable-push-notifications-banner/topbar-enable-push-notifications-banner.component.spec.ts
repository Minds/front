import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  PUSH_NOTIFICATION_BANNER_KEY,
  TopbarEnablePushNotificationsBannerComponent,
} from './topbar-enable-push-notifications-banner.component';
import { PushNotificationService } from '../../services/push-notification.service';
import { MockService } from '../../../utils/mock';
import { TopbarAlertService } from '../topbar-alert/topbar-alert.service';
import { ToasterService } from '../../services/toaster.service';

describe('TopbarEnablePushNotificationsBannerComponent', () => {
  let comp: TopbarEnablePushNotificationsBannerComponent;
  let fixture: ComponentFixture<TopbarEnablePushNotificationsBannerComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [TopbarEnablePushNotificationsBannerComponent],
      providers: [
        {
          provide: PushNotificationService,
          useValue: MockService(PushNotificationService),
        },
        {
          provide: TopbarAlertService,
          useValue: MockService(TopbarAlertService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    });

    fixture = TestBed.createComponent(
      TopbarEnablePushNotificationsBannerComponent
    );
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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('enableNotificationsClick', () => {
    it('should enable notifications', fakeAsync(() => {
      (comp as any).pushNotificationService.requestSubscription.and.returnValue(
        Promise.resolve(true)
      );

      (comp as any).enableNotificationsClick();
      tick();

      expect(
        (comp as any).pushNotificationService.requestSubscription
      ).toHaveBeenCalledOnceWith();
      expect((comp as any).topbarAlertService.dismiss).toHaveBeenCalledOnceWith(
        PUSH_NOTIFICATION_BANNER_KEY
      );
      expect((comp as any).toaster.success).toHaveBeenCalledOnceWith(
        'Push notifications enabled'
      );
      expect((comp as any).toaster.error).not.toHaveBeenCalled();
    }));

    it('should handle NotAllowedError when enabling notifications', fakeAsync(() => {
      (comp as any).pushNotificationService.requestSubscription.and.throwError({
        name: 'NotAllowedError',
      });

      (comp as any).enableNotificationsClick();
      tick();

      expect(
        (comp as any).pushNotificationService.requestSubscription
      ).toHaveBeenCalledOnceWith();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Permission denied'
      );
      expect(
        (comp as any).topbarAlertService.dismiss
      ).not.toHaveBeenCalledOnceWith(PUSH_NOTIFICATION_BANNER_KEY);
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
    }));

    it('should handle timeout when enabling notifications', fakeAsync(() => {
      (comp as any).pushNotificationService.requestSubscription.and.throwError({
        name: 'timeout',
      });

      (comp as any).enableNotificationsClick();
      tick();

      expect(
        (comp as any).pushNotificationService.requestSubscription
      ).toHaveBeenCalledOnceWith();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Something went wrong'
      );
      expect(
        (comp as any).topbarAlertService.dismiss
      ).not.toHaveBeenCalledOnceWith(PUSH_NOTIFICATION_BANNER_KEY);
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
    }));
  });

  describe('dismiss', () => {
    it('should dismiss', () => {
      (comp as any).dismiss();
      expect((comp as any).topbarAlertService.dismiss).toHaveBeenCalledOnceWith(
        PUSH_NOTIFICATION_BANNER_KEY
      );
    });
  });
});
