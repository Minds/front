import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { EntitiesService } from '../../../../../common/services/entities.service';
import { ProChannelService } from '../../channel.service';
import { Client } from '../../../../../services/api/client';

@Component({
  selector: 'm-proChannelHome__categoryContent',
  templateUrl: './category-content.component.html',
})
export class ProChannelHomeCategoryContent implements OnInit {
  categories$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public entitiesService: EntitiesService,
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

  /**
   * Called on activity deletion,
   * removes entity from this.entities$.
   *
   * @param category - the category the activity belongs to
   * @param activity - the activity deleted.
   */
  onActivityDelete(category: any, activity: any): void {
    const entities = category.entities$.getValue();

    entities.forEach((item, index) => {
      if (item.guid === activity.guid) {
        entities.splice(index, 1);
      }
    });
    category.entities$.next(entities);
  }
}
