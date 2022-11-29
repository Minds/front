import ActivityFeedPage from './activityFeedPage';
const { I, sidebarComponent } = inject();

/**
 * Channel page - contains reusable function relating to the channel page.
 */
class ChannelPage extends ActivityFeedPage {
  // selectors
  private readonly channelBoostButtonSelector: string =
    'm-channelActions__boost';

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

  /**
   * Open channel boost modal.
   * @returns { void }
   */
  public openChannelBoostModal(): void {
    I.click(this.channelBoostButtonSelector);
  }
}

module.exports = new ChannelPage();
module.exports.ChannelPage = ChannelPage;
export = new ChannelPage();
