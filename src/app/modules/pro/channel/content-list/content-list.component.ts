import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ProChannelService } from '../channel.service';
import { isPlatformServer } from '@angular/common';

/**
 * Container for the pro feed, including category filters
 */
@Component({
  selector: 'm-proChannel__contentList',
  templateUrl: 'content-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedsService],
})
export class ProChannelContentListComponent implements OnChanges {
  @Input() canAutoScroll = true;
  @Input() category: string;
  @Input() limit: number = 12;
  @Input() type: string;
  @Input() query: string;
  @Input() selectedHashtag: string;

  entities$: Observable<BehaviorSubject<Object>[]>;

  constructor(
    public feedsService: FeedsService,
    protected channelService: ProChannelService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.entities$ = this.feedsService.feed.pipe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.load(true);
  }

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

    if (this.type === 'groups' && isPlatformServer(this.platformId)) {
      return; // 503 timeout error
    }

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
