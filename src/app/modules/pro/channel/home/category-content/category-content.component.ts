import { Component } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import normalizeUrn from '../../../../../helpers/normalize-urn';
import { FeedsService } from '../../../../../common/services/feeds.service';
import { EntitiesService } from '../../../../../common/services/entities.service';
import { ProChannelService } from '../../channel.service';
import { Client } from '../../../../../services/api/client';

@Component({
  selector: 'm-proChannelHome__categoryContent',
  templateUrl: './category-content.component.html',
})
export class ProChannelHomeCategoryContent {
  categories$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public entitiesService: EntitiesService,
    private feedsService: FeedsService,
    protected channelService: ProChannelService,
    protected client: Client
  ) {}

  ngOnInit() {
    this.load();
  }

  async load(): Promise<void> {
    const { content } = (await this.client.get(
      `api/v2/pro/channel/${this.channelService.currentChannel.guid}/content`
    )) as any;

    const categories = content
      .filter(entry => entry && entry.content && entry.content.length)
      .map(entry => {
        entry.content = entry.content.map(item => {
          if (item.entity) {
            return of(item.entity);
          }

          return of(this.entitiesService.single(item.urn));
        });
        entry.entities$ = of(entry.content);
        return entry;
      });
    this.categories$.next(categories);
  }

  getCategoryRoute(tag) {
    if (!this.channelService.currentChannel || !tag) {
      return [];
    }

    return this.channelService.getRouterLink('all', { hashtag: tag });
  }
}
