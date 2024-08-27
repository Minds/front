import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationToasterV2Component } from './notification-toaster-v2.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { Router } from '@angular/router';
import { WINDOW } from '../../injection-tokens/common-injection-tokens';
import { BehaviorSubject } from 'rxjs';
import {
  NotificationToast,
  NotificationToasterV2Service,
} from './notification-toaster-v2.service';

describe('NotificationToasterV2Component', () => {
  let comp: NotificationToasterV2Component;
  let fixture: ComponentFixture<NotificationToasterV2Component>;
  let mockToast: NotificationToast = {
    text: 'test',
    type: 'info',
  };

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationToasterV2Component,
        MockComponent({
          selector: 'ngb-toast',
          inputs: ['autohide', 'delay'],
          outputs: ['click', 'hidden'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object'],
        }),
      ],
      providers: [
        {
          provide: NotificationToasterV2Service,
          useValue: MockService(NotificationToasterV2Service, {
            has: ['toasts$'],
            props: {
              toasts$: {
                get: () =>
                  new BehaviorSubject<NotificationToast[]>([mockToast]),
              },
            },
          }),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: WINDOW,
          useValue: jasmine.createSpyObj<Window>(['open']),
        },
      ],
    });

    fixture = TestBed.createComponent(NotificationToasterV2Component);
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

  describe('onToastClick', () => {
    it('should open window if href is http', () => {
      let toast: NotificationToast = mockToast;
      toast.href = 'https://www.test.com/';

      (comp as any).onToastClick(toast);

      expect((comp as any).window.open).toHaveBeenCalledWith(
        toast.href,
        '_blank'
      );
    });

    it('should navigate if href is not http', () => {
      let toast: NotificationToast = mockToast;
      toast.href = '/test';

      (comp as any).onToastClick(toast);

      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        toast.href
      );
    });
  });

  describe('removeToast', () => {
    it('should remove toast', () => {
      (comp as any).removeToast(mockToast);
      expect((comp as any).notificationToaster.remove).toHaveBeenCalledWith(
        mockToast
      );
    });
  });
});
