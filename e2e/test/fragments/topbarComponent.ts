const { I } = inject();

/**
 * Topbar component.
 */
class TopbarComponent {
  // selectors
  private topbarRootSelector: string = 'm-topbar';
  private notificationButtonSelector: string = 'm-notifications--topbar-toggle';
  private joinNowButton: CodeceptJS.Locator = locate(
    `${this.topbarRootSelector} m-button`
  ).withText('Join Now');

  /**
   * Open notifications flyout and wait for list to load.
   * @returns { Promise<void> }
   */
  public async openNotificationsFlyout(): Promise<void> {
    await Promise.all([
      I.click(this.notificationButtonSelector),
      I.waitForResponse(
        (resp) =>
          resp.url().includes('/api/v3/notifications/list') &&
          resp.status() === 200,
        30
      ),
    ]);
  }
  /**
   * Click join now button.
   * @returns { void }
   */
  public clickJoinNowButton(): void {
    I.click(this.joinNowButton);
  }
}

export = new TopbarComponent();
