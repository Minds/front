import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import {
  NavItems,
  ProChannelService,
  RouterLinkToType,
} from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-proChannel__contentList',
  templateUrl: 'content-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedsService],
})
export class ProChannelContentListComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() canAutoScroll = true;
  @Input() category: string;
  @Input() limit: number = 12;
  @Input() type: string;
  @Input() query: string;
  @Input() selectedHashtag: string;

  entities$: Observable<BehaviorSubject<Object>[]>;

  constructor(
    public feedsService: FeedsService,
    protected modalService: OverlayModalService,
    protected channelService: ProChannelService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected injector: Injector
  ) {
    this.entities$ = this.feedsService.feed.pipe();
  }

  ngOnInit() {
    //this.load(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load(true);
  }

  ngOnDestroy() {}

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    let params: any = {};

    if (this.selectedHashtag && this.selectedHashtag !== 'all') {
      params.hashtags = this.selectedHashtag;
    }

    if (this.query && this.query !== '') {
      params.period = '1y';
      params.all = 1;
      params.query = this.query;
      params.sync = 1;
    }

    params.force_public = 1;

    let url = `api/v2/pro/content/${this.channelService.currentChannel.guid}/${this.type}`;

    try {
      this.feedsService
        .setLimit(this.limit)
        .setOffset(0)
        .setEndpoint(url)
        .setParams(params)
        .setCastToActivities(false)
        .fetch();
    } catch (e) {
      console.error('ProChannelListComponent.load', e);
    }
  }

  get hasMore$() {
    return this.feedsService.hasMore;
  }

  get inProgress$() {
    return this.feedsService.inProgress;
  }

  loadMore() {
    this.feedsService.loadMore();
  }

  onTileClicked(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  /**
   * Called on activity deletion,
   * removes entity from this.entities$.
   *
   * @param activity - the activity deleted.
   */
  onActivityDelete(activity: any): void {
    this.entities$ = this.entities$.pipe(
      map(val =>
        val.filter(entity => entity.getValue()['guid'] !== activity.guid)
      ),
      catchError(error => {
        console.error(error);
        return this.entities$;
      })
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
