import ActivityFeedPage from './activityFeedPage';

const { I } = inject();

/**
 * Single entity page (SEP)
 */
class SingleEntityPage extends ActivityFeedPage {
  // Selectors
  private readonly backButtonSelector: string = '.m-goBack';

  /**
   * Check whether back button is visible
   * @param { boolean } shouldBeVisible - whether we are asserting there is or is not a back button on the page
   * @returns { void }
   */
  public backButtonShouldBeVisible(shouldBeVisible: boolean = false): void {
    if (shouldBeVisible) {
      I.seeElement(this.backButtonSelector);
      return;
    }
    I.dontSeeElement(this.backButtonSelector);
  }

  /**
   * Wait for boost modal to appear
   * @param { number } delayMs - milliseconds to wait before checking for element
   * @returns { void }
   */
  public waitForBoostModal(delayMs: number = 2000): void {
    // Convert ms to seconds because waitForElement() uses seconds
    I.waitForElement('m-boostModalV2', Math.ceil(delayMs / 1000));
  }
}

module.exports = new SingleEntityPage();
module.exports.SingleEntityPage = SingleEntityPage;
export = new SingleEntityPage();
