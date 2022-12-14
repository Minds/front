const { I, activityComponent } = inject();

/**
 * Activity feed page - should be extended by for example, newsfeed or channel.
 */
class ActivityFeedPage {
  // selectors.
  public activitySelector: string = 'm-activity';
  public readonly permalinkSelector: string = 'm-activity__permalink';
  public activityMediaLinkSelector: string =
    '.m-activityContentMedia__link:not(.m-activityContent__quote)';
  public activityPrimaryMediaLinkSelector: string =
    '.m-activityContentMedia__link:not(.m-activityContent__quote)';

  public async navigateToSingleEntityPageOfActivityInPosition(
    feedPosition: number = 1
  ): Promise<void> {
    const permalink = locate(this.permalinkSelector)
      .inside(this.activitySelector)
      .at(feedPosition);

    I.waitForElement(permalink);
    I.click(permalink);
  }

  /**
   * Delete an activity by its position in a feed.
   * @param { number } feedPosition - feed position to get activity for.
   * @returns { Promise<void> }
   */
  public async deleteActivityAtPosition(
    feedPosition: number = 1
  ): Promise<void> {
    await within(locate(this.activitySelector).at(feedPosition), async () => {
      await activityComponent.deleteActivity();
    });
  }

  /**
   * Delete an activity, getting it from the feed by its text content.
   * @param { string } text - text content to get activity containing.
   * @returns { Promise<void> }
   */
  public async deleteActivityByText(text: string): Promise<void> {
    await within(locate(this.activitySelector).withText(text), async () => {
      await activityComponent.deleteActivity();
    });
  }

  /**
   * Click to quote activity by text - will open composer.
   * @param { string } text - text content to get activity containing.
   * @returns { Promise<void> }
   */
  public async clickToQuoteActivityByText(text: string): Promise<void> {
    await within(locate(this.activitySelector).withText(text), async () => {
      activityComponent.clickQuoteButton();
    });
  }

  /**
   * Click activity timestamp - will navigate to single entity page.
   * @param { string } text - text content to get activity containing.
   * @returns { Promise<void> }
   */
  public async clickTimestampForActivityWithText(text: string): Promise<void> {
    await within(locate(this.activitySelector).withText(text), () => {
      activityComponent.clickTimestamp();
    });
  }

  /**
   * Click parent media for a quote post with matching text, may open activity modal.
   * @param { string } text - text content to get activity containing.
   * @returns { Promise<void> }
   */
  public async clickOnParentMediaForQuotePostWithText(
    text: string
  ): Promise<void> {
    await within(locate(this.activitySelector).withText(text), () => {
      I.click(this.activityPrimaryMediaLinkSelector);
    });
  }

  /**
   * Open boost modal for the activity with text.
   * @param text Text to open modal for.
   * @returns { Promise<void> }
   */
  public async openBoostModalForActivityWithText(text: string): Promise<void> {
    await within(locate(this.activitySelector).withText(text), () => {
      activityComponent.openBoostModal();
    });
  }

  /**
   * Determine whether feed has an activity with the given text.
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public hasActivityWithText(text: string): void {
    I.seeElement(locate(this.activitySelector).withText(text));
  }

  /**
   * Determine whether feed DOES NOT have an activity with the given text.
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public hasNoActivityWithText(text: string): void {
    I.dontSeeElement(locate(this.activitySelector).withText(text));
  }
}

module.exports = new ActivityFeedPage();
module.exports.ActivityFeedPage = ActivityFeedPage;
export = ActivityFeedPage;
