import { ActivityFeedPage } from './activityFeedPage';
const { I } = inject();

/**
 * Newsfeed page - common functions for newsfeed.
 */
export class NewsfeedPage extends ActivityFeedPage {
  public newsfeedURI: string = '/newsfeed/subscriptions/latest';

  /**
   * Navigate to newsfeed by URL.
   * @returns { void }
   */
  public navigateToByUrl(): void {
    I.amOnPage(this.newsfeedURI);
  }

  get composerBox(): string {
    return `m-newsfeed m-composer .m-composer__trigger`;
  }

  openComposer() {
    I.waitForElement(this.composerBox, 5);
    I.click(this.composerBox);
  }
}
