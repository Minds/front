import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PushNotificationService } from '../../../../common/services/push-notification.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { NotificationsEnablePushBannerComponent } from './enable-push-banner.component';
import { MockComponent, MockService } from '../../../../utils/mock';

describe('NotificationsEnablePushBannerComponent', () => {
  let comp: NotificationsEnablePushBannerComponent;
  let fixture: ComponentFixture<NotificationsEnablePushBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        MockComponent({
          selector: 'm-button',
          inputs: ['saving'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: PushNotificationService,
          useValue: MockService(PushNotificationService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(NotificationsEnablePushBannerComponent);
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

  it('should call to enable push notifications onButtonClick function call', async () => {
    comp.inProgress$.next(false);
    (comp as any).pushNotifications.requestSubscription.and.returnValue(true);

    await comp.onButtonClick(null);

    expect((comp as any).toast.success).toHaveBeenCalledWith(
      'Web push notifications enabled.'
    );
    expect(comp.inProgress$.getValue()).toBeFalsy();
  });

  it('should display an error if not allowed to enable push notifications onButtonClick', async () => {
    comp.inProgress$.next(false);
    (comp as any).pushNotifications.requestSubscription.and.returnValue(
      Promise.reject({ name: 'NotAllowedError' })
    );

    await comp.onButtonClick(null);

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'Your browser blocked Minds notifications. Change site settings in your browser to allow and try again.'
    );
    expect(comp.inProgress$.getValue()).toBeFalsy();
  });

  it('should display an error if there is a timeout on onButtonClick', async () => {
    comp.inProgress$.next(false);
    (comp as any).pushNotifications.requestSubscription.and.returnValue(
      Promise.reject({ name: 'timeout' })
    );

    await comp.onButtonClick(null);

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'Something went wrong'
    );
    expect(comp.inProgress$.getValue()).toBeFalsy();
  });

  it('should display an error if there is an unknown failure on onButtonClick', async () => {
    (comp as any).pushNotifications.requestSubscription.and.returnValue(
      Promise.reject({ name: 'unknown' })
    );

    await comp.onButtonClick(null);

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'Something went wrong'
    );
    expect(comp.inProgress$.getValue()).toBeFalsy();
  });
});
