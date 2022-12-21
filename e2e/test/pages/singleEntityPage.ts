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
}

module.exports = new SingleEntityPage();
module.exports.SingleEntityPage = SingleEntityPage;
export = new SingleEntityPage();
