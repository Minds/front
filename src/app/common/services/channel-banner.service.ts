import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';
import { Session } from '../../services/session';
import { MindsUser } from '../../interfaces/entities';

/**
 * Channel Banner Service.
 * Used to derive a users seeded default banner.
 */
@Injectable()
export class ChannelBannerService {
  private cdnAssetsUrl = '';

  constructor(private configs: ConfigsService, private session: Session) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url') || '/';
  }

  /**
   * Gets banner URL seeded for a channel.
   * @param { MindsUser } channel - the subject.
   * @param { boolean } highRes - default true.
   * @returns { string } url of banner.
   */
  public getSeededBannerUrl(channel: MindsUser, highRes = true): string {
    if (!channel) {
      return '';
    }
    const resolutionFolder: string = highRes ? '2x' : '1x';
    return (
      this.cdnAssetsUrl +
      'assets/photos/banners/' +
      resolutionFolder +
      `/${this.deriveBannerId(channel)}.jpg`
    );
  }

  /**
   * Derives an Id between 1 - 10 from the users GUID.
   * @param { MindsUser } channel - derivation subject.
   * @returns { number } - The derived ID
   */
  private deriveBannerId(channel: MindsUser): number {
    const guid: number = parseInt(channel.guid);
    return guid % 10;
  }
}
