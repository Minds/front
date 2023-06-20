const { I } = inject();

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

  get noGroupsFeedNoticeTitle(): string {
    return 'm-feedNotice [data-ref=feed-notice-title-no-groups]';
  }

  get recommendedGroupsTitle(): string {
    return 'm-publisherRecommendations [data-ref=publisher-recommendations-title-groups]';
  }

  clickCreateGroupButton() {
    I.click(locate(this.createGroupButton));
  }

  clickDiscoverGroupsButton() {
    I.click(locate(this.discoverGroupsButton));
  }

  /**
   * Whether the page has a given feed notice.
   * @param { FeedNoticeKey } feedNoticeKey - key to check for.
   * @returns { void }
   */
  public hasNoGroupsFeedNotice(): void {
    I.seeElement(locate(this.noGroupsFeedNoticeTitle));
  }

  /**
   * Whether the page has group recommendations
   * @returns { void }
   */
  public hasRecommendedGroups(): void {
    I.seeElement(locate(this.recommendedGroupsTitle));
  }
}

module.exports = new GroupsMembershipPage();
module.exports.GroupsMembershipPage = GroupsMembershipPage;
export = new GroupsMembershipPage();
