import { Inject, Injectable } from '@angular/core';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../../common/services/meta.service';
import { MindsGroup } from '../group.model';
import { CDN_URL } from '../../../../common/injection-tokens/url-injection-tokens';

/**
 * SEO meta headers service for groups
 */
@Injectable()
export class GroupSeoService {
  /**
   * Constructor
   * @param meta
   */
  constructor(
    protected meta: MetaService,
    @Inject(CDN_URL) private readonly cdnUrl
  ) {}

  /**
   * Sets SEO meta headers
   * @param user
   */
  set(group: MindsGroup): void {
    if (typeof group === 'string') {
      this.meta.setTitle(group);
      return;
    }

    this.meta.setTitle(group.name).setOgImage(this.getAvatarUrl(group), {
      height: 315,
      width: 600,
    });

    if (group.briefdescription) {
      this.meta.setDescription(group.briefdescription);
    }

    if (group.mature || group.nsfw.length) {
      this.meta.setNsfw(true);
    }
  }

  /**
   * Gets avatar URL for a given group.
   * @param { MindsGroup } group - Minds group to get avatar for.
   * @returns { string } group URL.
   */
  private getAvatarUrl(group: MindsGroup): string {
    const iconTime: number = group.icontime ?? Date.now();
    return `${this.cdnUrl}fs/v1/avatars/${group.guid}/large/${iconTime}`;
  }
}
