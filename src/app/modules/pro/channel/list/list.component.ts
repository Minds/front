import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { FeedsService } from "../../../../common/services/feeds.service";
import { ProService } from "../../pro.service";

@Component({
  selector: 'm-pro--channel-list',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProChannelListComponent implements OnInit {

  type: string;

  params$: Subscription;

  constructor(
    public feedsService: FeedsService,
    private proService: ProService,
    private route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
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
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    try {
      this.feedsService
        .setEndpoint(`api/v2/feeds/channel/${this.proService.currentChannel.guid}/${this.type}`)
        .setLimit(8)
        .fetch();

    } catch (e) {
      console.error('ProChannelListComponent.load', e);
    }

    this.detectChanges();
  }

  loadNext() {
    this.feedsService.loadMore();
  }

  seeMore() {
    let url = `${window.Minds.site_url}${this.proService.currentChannel.username}`;

    let type = this.type;

    if (this.type === 'feed') {
      type = null;
    }
    else if (this.type === 'articles') {
      type = 'blogs';
    }

    if (type) {
      url += `/${type}`;
    }
    window.location.href = url;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
