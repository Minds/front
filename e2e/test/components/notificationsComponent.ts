import { TopbarComponent } from './topbarComponent';

const { I } = inject();
const topbarComponent = new TopbarComponent();

/**
 * Notifications component.
 */
export class NotificationsComponent {
  private notificationBodySelector: string =
    '.m-notificationsNotification__body';

  /**
   * Open notification flyout.
   * @returns { Promise<void> }
   */
  public async openFlyout(): Promise<void> {
    await topbarComponent.openNotificationsFlyout();
  }

  /**
   * Click first notification.
   * @returns { void }
   */
  public clickFirstNotification(): void {
    I.click(this.notificationBodySelector);
  }
}
