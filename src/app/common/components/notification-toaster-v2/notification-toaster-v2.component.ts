import { Component, Inject } from '@angular/core';
import {
  NotificationToast,
  NotificationToasterV2Service,
} from './notification-toaster-v2.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { WINDOW } from '../../injection-tokens/common-injection-tokens';

/**
 * Notification toaster component - will show a toaster at the
 * top of the users screen to notify them of new information.
 */
@Component({
  selector: 'm-notificationToaster',
  template: `
    <ng-container *ngFor="let toast of toasts$ | async">
      <ngb-toast
        class="m-notificationToast"
        [ngClass]="{
          'm-notificationToaster__toast--info': toast.type === 'info',
          'm-notificationToaster__toast--success': toast.type === 'success',
          'm-notificationToaster__toast--danger': toast.type === 'danger'
        }"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (click)="onToastClick(toast)"
        (hidden)="removeToast(toast)"
        aria-live="polite"
      >
        <minds-avatar
          *ngIf="toast.avatarObject"
          [object]="toast.avatarObject"
        ></minds-avatar>
        <span>{{ toast.text }}</span>
      </ngb-toast>
    </ng-container>
  `,
  styleUrls: ['./notification-toaster-v2.component.ng.scss'],
})
export class NotificationToasterV2Component {
  /** Toasts. */
  protected readonly toasts$: Observable<NotificationToast[]> =
    this.notificationToaster.toasts$;

  constructor(
    private notificationToaster: NotificationToasterV2Service,
    private router: Router,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  /**
   * Handle toast click.
   * @param { NotificationToast } toast - toast.
   * @returns { void }
   */
  protected onToastClick(toast: NotificationToast): void {
    if (toast.href) {
      if (toast.href.startsWith('http')) {
        this.window.open(toast.href, '_blank');
      } else {
        this.router.navigateByUrl(toast.href);
      }
    }
    this.removeToast(toast);
  }

  /**
   * Remove toast.
   * @param { NotificationToast } toast - toast.
   * @returns { void }
   */
  protected removeToast(toast: NotificationToast): void {
    this.notificationToaster.remove(toast);
  }
}
