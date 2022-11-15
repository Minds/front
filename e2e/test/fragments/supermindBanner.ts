const { I } = inject();

/**
 * Supermind banner fragment
 */
export class SupermindBannerFragment {
  // selectors
  private readonly supermindBannerSelector: string = 'm-supermind__banner';
  private readonly supermindBannerActionButtonSelector: string =
    '[data-ref=supermind-banner-action-button]';

  /**
   * Wait for the 'upgradeComment' supermind banner to appear
   */
  public waitForUpgradeCommentSupermindBanner(): void {
    const upgradeCommentSupermindBanner = locate(this.supermindBannerSelector)
      .inside('m-comment__poster')
      .withDescendant(this.supermindBannerActionButtonSelector);

    I.waitForElement(upgradeCommentSupermindBanner, 10);
  }

  /**
   * Click the supermind button inside the banner
   * @return { void }
   */
  public clickSupermindBannerActionButton(): void {
    I.click(this.supermindBannerActionButtonSelector);
  }
}
