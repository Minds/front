import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FeedsService } from '../../../../../common/services/feeds.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'm-onboarding__channelList',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelListComponent implements OnInit {
  minds = window.Minds;
  inProgress: boolean = false;
  error: string;
  entities: any[] = [];

  constructor(
    public feedsService: FeedsService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.feedsService.clear();
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
      this.detectChanges();
    });

    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const hashtags = '';
      const period = '30d';
      const all = '';
      const query = '';
      const nsfw = [];

      this.feedsService
        .setEndpoint(`api/v2/feeds/global/top/channels`)
        .setParams({
          hashtags,
          period,
          all,
          query,
          nsfw,
        })
        .setLimit(3)
        .setExportUserCounts(true)
        .fetch();
    } catch (e) {
      console.error('SortedComponent', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
