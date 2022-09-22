require('dotenv').config();

export class ChannelPage {
  /**
   * Supermind
   */
  get supermindButton(): string {
    return 'm-channelactions__supermind m-button';
  }
}
