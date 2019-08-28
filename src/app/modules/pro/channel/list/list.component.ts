import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FeedsService } from "../../../../common/services/feeds.service";
import { ProChannelService, RouterLinkToType } from '../channel.service';
import { first } from "rxjs/operators";
import { OverlayModalService } from "../../../../services/ux/overlay-modal";
import { ProChannelListModal } from '../list-modal/list-modal.component';

@Component({
  selector: 'm-pro--channel-list',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedsService],
})
export class ProChannelListComponent implements OnInit, OnDestroy {

  paramsType: string; // exact string that came from the router params

  type: string;

  params$: Subscription;

  entities: any[] = [];

  algorithm: string;

  query: string;

  period: string;

  displaySeeMoreTile: boolean = false;

  selectedHashtag: string = 'all';

  constructor(
    public feedsService: FeedsService,
    protected modalService: OverlayModalService,
    protected channelService: ProChannelService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
  ) {
  }

  ngOnInit() {
    this.listen();
  }

  private listen() {
    this.params$ = this.route.params.subscribe(params => {
      this.entities = [];
      if (params['type']) {
        this.type = this.paramsType = params['type'];
      }
      switch (params['type']) {
        case 'all':
          this.type = 'all';
          break;
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
      this.algorithm = params['algorithm'] || 'top';
      this.query = params['query'] || '';
      this.period = params['period'] || '';
      this.selectedHashtag = params['hashtag'] || 'all';

      this.load(true);
    });

    this.feedsService.feed.subscribe(async (entities) => {
      if (!entities.length)
        return;
      for (const entity of entities) {
        if (entity)
          this.entities.push(await entity.pipe(first()).toPromise());
      }

      if (this.entities.length >= 10) {
        this.displaySeeMoreTile = true;
        this.entities = this.entities.slice(0, 9);
      }

      this.detectChanges();
    });

  }

  ngOnDestroy() {
    if (this.params$) {
      this.params$.unsubscribe();
    }
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.entities = [];
      this.feedsService.clear();
    }

    this.displaySeeMoreTile = false;

    this.detectChanges();

    let params: any = {};

    if (this.selectedHashtag && this.selectedHashtag !== 'all') {
      params.hashtags = this.selectedHashtag;
    }

    if (this.query && (this.query !== '')) {
      params.period = this.period;
      params.all = 1;
      params.query = this.query;
      params.sync = 1;
    }

    let url = `api/v2/feeds/channel/${this.channelService.currentChannel.guid}/${this.type}/${this.algorithm}`;

    try {
      this.feedsService
        .setEndpoint(url)
        .setParams(params)
        .setCastToActivities(false)
        .setLimit(10)
        .fetch();

    } catch (e) {
      console.error('ProChannelListComponent.load', e);
    }
  }

  loadNext() {
    this.feedsService.loadMore();
  }

  get inProgress$() {
    return this.feedsService.inProgress;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  seeMore() {
    this.modalService
      .create(ProChannelListModal, {
          type: this.type,
          algorithm: 'latest',
          query: this.query,
          hashtag: this.selectedHashtag
        },
        {
          class: 'm-overlayModal--seeMore'
        }, this.injector)
      .present();
  }

  onTileClicked(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  selectHashtag(tag: string) {
    let params;

    if (tag) {
      params = { hashtag: tag };
    }

    return this.router.navigate(this.channelService.getRouterLink(this.paramsType as RouterLinkToType, params))
  }

  get shouldShowCategories() {
    return this.paramsType !== 'groups' && this.paramsType !== 'feed';
  }
}
