import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../services/session';
import { NotificationService } from './notification.service';
import isMobileOrTablet from '../../helpers/is-mobile-or-tablet';

/**
 * Topbar notification bell toggle.
 */
@Component({
  moduleId: module.id,
  selector: 'm-notifications--topbar-toggle',
  templateUrl: 'toggle.component.html',
  styleUrls: ['toggle.component.ng.scss'],
})
export class NotificationsTopbarToggleComponent {
  toggled: boolean = false;
  @ViewChild('notificationsFlyout') flyout: any;

  constructor(
    public session: Session,
    public service: NotificationService,
    private router: Router
  ) {}

  /**
   * Toggle notification flyout or navigate to fullscreen notifications for mobile.
   * @param { unknown } e - event.
   * @returns { void }
   */
  toggle(e: unknown): void {
    if (isMobileOrTablet()) {
      this.router.navigate(['/notifications/v3']);
      return;
    }
    this.toggled = !this.toggled;
    if (this.toggled) {
      this.flyout.toggleLoad();
    }
  }
}
