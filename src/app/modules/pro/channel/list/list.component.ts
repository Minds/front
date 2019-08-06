import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FeedsService } from "../../../../common/services/feeds.service";
import { ProChannelService } from '../channel.service';
import { first } from "rxjs/operators";
import { OverlayModalService } from "../../../../services/ux/overlay-modal";
import { ProContentModalComponent } from "../content-modal/modal.component";
import { ProChannelListModal } from '../list-modal/list-modal.component';

@Component({
  selector: 'm-pro--channel-list',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedsService],
})
export class ProChannelListComponent implements OnInit, OnDestroy {

  type: string;

  params$: Subscription;

  entities: any[] = [];

  algorithm: string;

  query: string;

  period: string;

  displaySeeMoreTile: boolean = false;

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
      this.algorithm = params['algorithm'] || 'top';
      this.query = params['query'] || '';
      this.period = params['period'] || '';
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
      this.feedsService.clear();
    }

    this.displaySeeMoreTile = false;

    this.detectChanges();

    let search = '';
    if (this.query && (this.query !== '')) {
      search = `?hashtags=null&period=${this.period}&all=1&query=${this.query}&nsfw=&sync=1&limit=150&as_activities=1&from_timestamp=`;
    }

    try {
      this.feedsService
        .setEndpoint(`api/v2/feeds/channel/${this.channelService.currentChannel.guid}/${this.type}/${this.algorithm}${search}`)
        .setLimit(10)
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

  seeMore() {
    this.modalService
      .create(ProChannelListModal, { type: this.type, algorithm: 'latest', query: this.query }, void 0, this.injector)
      .present();
  }

  get channelUsername() {
    return this.channelService.currentChannel.username
  }

  /**
   * Returns the feed type on par to routes
   * @param type feed type
   */
  getTypeForRoute(type: string): string {
    let routeType = '';
    switch (type) {
      case 'videos':
        routeType = 'videos';
        break;
      case 'images':
        routeType = 'images';
        break;
      case 'blogs':
        routeType = 'articles';
        break;
      case 'groups':
        routeType = 'groups';
        break;
      case 'activities':
        routeType = 'feed';
        break;
      default:
        throw new Error('Unknown type');
    }
    return routeType;
  }

  onTileClicked(entity: any) {
    switch (this.getType(entity)) {
      case 'object:blog':
        window.open(`${window.Minds.site_url}${entity.route}/`, '_blank');
        break;
      case 'object:image':
      case 'object:video':
        this.modalService.create(ProContentModalComponent, entity, {
          class: 'm-overlayModal--media'
        }).present();
        break;
    }
  }

  private getType(entity: any) {
    return entity.type === 'object' ? `${entity.type}:${entity.subtype}` : entity.type;
  }
}
