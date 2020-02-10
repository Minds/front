import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../common/directives/dynamic-host.directive';
import { NotificationService } from './notification.service';
import { Session } from '../../services/session';

@Component({
  selector: 'm-notifications--toaster',
  template: `
    <div class="m-notifications--toaster" *ngIf="notifications">
      <minds-notification
        *ngFor="let notification of notifications"
        class="mdl-card mdl-shadow--4dp item"
        [notification]="notification"
        (click)="closeNotification(notification)"
      ></minds-notification>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsToasterComponent implements OnInit {
  notifications: Array<any> = [];

  @ViewChild(DynamicHostDirective, { static: false })
  host: DynamicHostDirective;

  constructor(
    public notification: NotificationService,
    protected cd: ChangeDetectorRef,
    private session: Session
  ) {}

  ngOnInit() {
    this.listenForNotifications();
  }

  listenForNotifications() {
    this.notification.onReceive.subscribe((notification: any) => {
      if (this.isToasterDisabled()) return;

      this.notifications.unshift(notification);
      this.detectChanges();

      setTimeout(() => {
        this.closeNotification(notification);
      }, 6000);
    });
  }

  closeNotification(notification: any) {
    let dirty = false;
    let i: any;

    for (i in this.notifications) {
      if (this.notifications[i] === notification) {
        this.notifications.splice(i, 1);
        dirty = true;
      }
    }

    if (dirty) {
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  isToasterDisabled() {
    return (
      this.session.getLoggedInUser() &&
      !this.session.getLoggedInUser().toaster_notifications
    );
  }
}
