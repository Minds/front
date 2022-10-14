import { SidebarComponent } from '../components/sidebarComponent';
import { ActivityFeedPage } from './activityFeedPage';
const sidebarComponent = new SidebarComponent();

require('dotenv').config();
/**
 * Channel page - contains reusable function relating to the channel page.
 */
export class ChannelPage extends ActivityFeedPage {
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
