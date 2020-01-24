import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../../../../../common/services/feeds.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'm-onboarding__groupList',
  templateUrl: 'list.component.html',
})
export class GroupListComponent implements OnInit {
  minds = window.Minds;
  inProgress: boolean = false;
  error: string;

  entities: any[] = [];

  constructor(public feedsService: FeedsService) {}

  ngOnInit() {
    this.feedsService.feed.subscribe(async entities => {
      if (!entities.length) {
        return;
      }
      this.entities = [];
      for (const entity of entities) {
        if (entity) {
          this.entities.push(await entity.pipe(first()).toPromise());
        }
      }
    });

    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.inProgress = true;

    try {
      const hashtags = '';
      const period = '1y';
      const all = '';
      const query = '';
      const nsfw = [];

      this.feedsService
        .setEndpoint(`api/v2/feeds/global/top/groups`)
        .setParams({
          hashtags,
          period,
          all,
          query,
          nsfw,
        })
        .setLimit(3)
        .setCastToActivities(true)
        .fetch();
    } catch (e) {
      console.error('SortedComponent', e);
    }

    this.inProgress = false;
  }
}
