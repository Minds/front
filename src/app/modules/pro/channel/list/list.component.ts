import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { FeedsService } from "../../../../common/services/feeds.service";
import { ProChannelService } from '../channel.service';
import { first } from "rxjs/operators";

@Component({
  selector: 'm-pro--channel-list',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProChannelListComponent implements OnInit {

  type: string;

  params$: Subscription;

  entities: any[] = [];

  constructor(
    public feedsService: FeedsService,
    protected channelService: ProChannelService,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      this.entities = [];
      if (params['type']) {
        this.type = params['type'];
      }

      switch (params['type']) {
        case 'videos':
          this.type = 'videos';
          break;
        case 'images':
          this.type = 'images';
          break;
        case 'articles':
          this.type = 'blogs';
          break;
        case 'groups':
          this.type = 'groups';
          break;
        case 'feed':
          this.type = 'activities';
          break;
        default:
          throw new Error('Unknown type');
      }

      this.load(true);
    });

    this.feedsService.feed.subscribe(async entities => {
      if (!entities.length)
        return;

      for (const entity of entities) {
        if (entity)
          this.entities.push(await entity.pipe(first()).toPromise());
      }

      this.detectChanges();
    });
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    try {
      this.feedsService
        .setEndpoint(`api/v2/feeds/channel/${this.channelService.currentChannel.guid}/${this.type}`)
        .setLimit(9)
        .fetch();

    } catch (e) {
      console.error('ProChannelListComponent.load', e);
    }
  }

  loadNext() {
    this.feedsService.loadMore();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get seeMoreRoute() {
    return ['/', this.channelService.currentChannel.username];
  }
}
