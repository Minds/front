import { Injectable } from '@angular/core';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../../common/services/meta.service';
import { MindsGroup } from '../group.model';

/**
 * SEO meta headers service for groups
 */
@Injectable()
export class GroupSeoService {
  /**
   * Constructor
   * @param meta
   */
  constructor(protected meta: MetaService) {}

  /**
   * Sets SEO meta headers
   * @param user
   */
  set(group: MindsGroup | string): void {
    if (typeof group === 'string') {
      this.meta.setTitle(group);
      return;
    }

    // TODO
    // if (group.not_found || !group.avatar_url) {
    //   return;
    // }

    // const url = `/${user.username.toLowerCase()}/`;
    // this.meta
    //   .setTitle(`${user.name} (@${user.username})`)
    //   .setDescription(user.briefdescription || `Subscribe to @${user.username}`)
    //   .setOgUrl(url)
    //   .setCanonicalUrl(url)
    //   .setOgImage(user.avatar_url.master, {
    //     width: 2000,
    //     height: 1000,
    //   })
    //   .setOgType('profile')
    //   .setRobots(
    //     user['subscribers_count'] < MIN_METRIC_FOR_ROBOTS ? 'noindex' : 'all'
    //   );

    // if (user.is_mature || user.nsfw.length) {
    //   this.meta.setNsfw(true);
    // }
  }
}
