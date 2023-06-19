import { FeedNoticeKey } from '../types/feednotice.types';

const { I, feedNoticeComponent } = inject();

/**
 * The page that shows what groups you are a member of
 */
class GroupsMembershipPage {
  public groupsMembershipURI: string = '/groups/memberships';

  /**
   * Navigate to newsfeed by URL.
   * @returns { void }
   */
  public navigateToByUrl(): void {
    I.amOnPage(this.groupsMembershipURI);
  }

  get createGroupButton(): string {
    return '[data-ref=find-groups-buttons-create-group]';
  }
  get discoverGroupsButton(): string {
    return '[data-ref=find-groups-buttons-discover-groups]';
  }

  get feedNotice(): string {
    return 'm-feedNotice';
  }

  get publisherRecs(): string {
    return 'm-publisherRecommendations';
  }

  clickCreateButton() {
    I.waitForElement(this.createGroupButton, 5);
    I.click(this.createGroupButton);
  }

  clickDiscoverButton() {
    I.waitForElement(this.discoverGroupsButton, 5);
    I.click(this.discoverGroupsButton);
  }

  /**
   * Whether the page has a given feed notice.
   * @param { FeedNoticeKey } feedNoticeKey - key to check for.
   * @returns { void }
   */
  public hasFeedNotice(feedNoticeKey: FeedNoticeKey = 'no-groups'): void {
    feedNoticeComponent.has(feedNoticeKey);
  }
}

module.exports = new GroupsMembershipPage();
module.exports.GroupsMembershipPage = GroupsMembershipPage;
export = new GroupsMembershipPage();
