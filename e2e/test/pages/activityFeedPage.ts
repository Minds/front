import { ActivityComponent } from '../components/activityComponent';

const { I } = inject();
const activityComponent = new ActivityComponent();

/**
 * Activity feed page - should be extended by for example, newsfeed or channel.
 */
export class ActivityFeedPage {
  // selectors.
  public activitySelector: string = 'm-activity';

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
