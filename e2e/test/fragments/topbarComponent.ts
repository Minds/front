import { assert } from 'console';

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
  private avatarSelector: string = '[data-ref=topnav-avatar] .minds-avatar';

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

  /**
   * Verify that the avatar image is valid.
   * @returns { Promise<void> }
   */
  public async verifyAvatarImageIsValid(): Promise<void> {
    let styleAttribute: any = await I.grabAttributeFrom(
      this.avatarSelector,
      'style'
    );
    assert(
      /^url\(.+\/icon\/\d+\/large\/\d+\"\)$/.test(
        styleAttribute.backgroundImage
      ),
      'Avatar is not set correctly in the topbar, found value: ' +
        styleAttribute.backgroundImage
    );
  }
}

export = new TopbarComponent();
