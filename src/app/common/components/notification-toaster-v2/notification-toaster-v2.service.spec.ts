import { TestBed } from '@angular/core/testing';
import {
  NotificationToast,
  NotificationToasterV2Service,
} from './notification-toaster-v2.service';
import { take } from 'rxjs';

describe('NotificationToasterV2Service', () => {
  let service: NotificationToasterV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationToasterV2Service],
    });
    service = TestBed.inject(NotificationToasterV2Service);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('toasts$', () => {
    afterEach(() => {
      service.toasts$.next([]);
    });

    it('should push info toast  to toasts array', (done: DoneFn): void => {
      const toast: Omit<NotificationToast, 'type'> = {
        text: 'info',
      };

      service.info(toast);

      service.toasts$
        .pipe(take(1))
        .subscribe((toasts: NotificationToast[]): void => {
          expect(toasts.length).toBe(1);
          expect(toasts).toContain({
            text: 'info',
            type: 'info',
          });
          done();
        });
    });

    it('should push info toast to success array', (done: DoneFn): void => {
      const toast: Omit<NotificationToast, 'type'> = {
        text: 'success',
      };

      service.success(toast);

      service.toasts$
        .pipe(take(1))
        .subscribe((toasts: NotificationToast[]): void => {
          expect(toasts.length).toBe(1);
          expect(toasts).toContain({
            text: 'success',
            type: 'success',
          });
          done();
        });
    });

    it('should push info toast to danger array', (done: DoneFn): void => {
      const toast: Omit<NotificationToast, 'type'> = {
        text: 'danger',
      };

      service.danger(toast);

      service.toasts$
        .pipe(take(1))
        .subscribe((toasts: NotificationToast[]): void => {
          expect(toasts.length).toBe(1);
          expect(toasts).toContain({
            text: 'danger',
            type: 'danger',
          });
          done();
        });
    });

    it('should remove toast from toasts array', (done: DoneFn): void => {
      const toast: NotificationToast = {
        text: 'test',
        type: 'info',
      };

      service.toasts$.next([toast]);

      service.remove(toast);

      service.toasts$
        .pipe(take(1))
        .subscribe((toasts: NotificationToast[]): void => {
          expect(toasts.length).toBe(0);
          done();
        });
    });
  });
});
