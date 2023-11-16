const { I } = inject();

/**
 * Upgrade (Page) Modal
 */
class UpgradeModalComponent {
  // selectors.
  private readonly upgradeModalSelector: string = 'm-upgradePage';

  /**
   * Is the modal visible?
   * @returns { void }
   */
  public isVisible(): void {
    I.wait(1);
    I.seeElement(locate(this.upgradeModalSelector));
  }

  /**
   * Dismiss the modal
   * @returns { void }
   */
  public dismiss(): void {
    const closeButton = locate('[data-ref=modal-close-button]');
    I.click(closeButton.inside(this.upgradeModalSelector));
  }
}

export = new UpgradeModalComponent();
