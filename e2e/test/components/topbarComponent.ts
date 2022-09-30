const { I } = inject();

/**
 * Topbar component.
 */
export class TopbarComponent {
  private notificationButtonSelector: string = 'm-notifications--topbar-toggle';

  /**
   * Open notifications flyout and wait for list to load.
   * @returns { Promise<void> }
   */
  public async openNotificationsFlyout(): Promise<void> {
    await Promise.all([
      I.click(this.notificationButtonSelector),
      I.waitForResponse(
        resp =>
          resp.url().includes('/api/v3/notifications/list') &&
          resp.status() === 200,
        30
      ),
    ]);
  }
}
