import ActivityFeedPage from './activityFeedPage';
const { sidebarComponent } = inject();

/**
 * Channel page - contains reusable function relating to the channel page.
 */
class ChannelPage extends ActivityFeedPage {
  /**
   * Navigate to the channel page by sidebar.
   * @returns { void }
   */
  public navigateTo(): void {
    sidebarComponent.openChannel();
  }

  /**
   * Supermind
   */
  get supermindButton(): string {
    return 'm-channelactions__supermind m-button';
  }
}

module.exports = new ChannelPage();
module.exports.ChannelPage = ChannelPage;
export = new ChannelPage();
