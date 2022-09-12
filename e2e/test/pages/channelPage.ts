require('dotenv').config();
const { I } = inject();

class ChannelPage {
  /**
   * Supermind
   */
  get supermindButton(): string {
    return 'm-channelactions__supermind m-button';
  }
}

export = ChannelPage;
