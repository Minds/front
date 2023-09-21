import { Injectable } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../common/services/meta.service';

/**
 * SEO meta headers service
 */
@Injectable()
export class SeoService {
  /**
   * Constructor
   * @param meta
   */
  constructor(protected meta: MetaService) {}

  /**
   * Sets SEO meta headers
   * @param user
   */
  set(user: MindsUser | string): void {
    if (typeof user === 'string') {
      this.meta.setTitle(user);
      return;
    }

    if (user.not_found || !user.avatar_url) {
      return;
    }

    const url = `/${user.username.toLowerCase()}/`;
    this.meta
      .setTitle(`${user.name} (@${user.username})`)
      .setDescription(user.briefdescription || `Subscribe to @${user.username}`)
      .setOgUrl(url)
      .setCanonicalUrl(user?.canonical_url ?? url)
      .setOgImage(user.avatar_url.master, {
        width: 2000,
        height: 1000,
      })
      .setOgType('profile')
      .setRobots(
        user['subscribers_count'] < MIN_METRIC_FOR_ROBOTS ? 'noindex' : 'all'
      );

    if (user.is_mature || user.nsfw.length) {
      this.meta.setNsfw(true);
    }
  }
}
