import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  DiscoveryFeedsService,
  DiscoveryFeedsContentFilter,
} from './feeds.service';
import { Subscription, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FeedsService } from '../../../common/services/feeds.service';
import { NewPostsService } from '../../../common/services/new-posts.service';

@Component({
  selector: 'm-discovery__feedsList',
  templateUrl: './feeds-list.component.html',
})
export class DiscoveryFeedsListComponent implements OnInit, OnDestroy {
  entities$ = this.service.entities$;
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;
  feedsSubscription: Subscription;
  showNewPostsIntentSubscription: Subscription;

  @ViewChild('feedEl') feedEl;

  constructor(
    private service: DiscoveryFeedsService,
    protected newPostsService: NewPostsService
  ) {}

  ngOnInit() {
    this.feedsSubscription = combineLatest(
      this.service.nsfw$,
      this.service.type$,
      this.service.period$
    )
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.service.load();
      });

    this.showNewPostsIntentSubscription = this.newPostsService.showNewPostsIntent$.subscribe(
      intent => {
        if (intent) {
          this.loadNewPosts();
        }
      }
    );
  }

  loadNewPosts(): void {
    const el = this.feedEl;
    if (el && el.nativeElement) {
      el.nativeElement.scrollIntoView({
        block: 'start',
        inline: 'nearest',
      });
    }

    this.service.load();
  }

  ngOnDestroy() {
    this.feedsSubscription.unsubscribe();
    this.showNewPostsIntentSubscription.unsubscribe();
  }

  loadMore() {
    this.service.loadMore();
  }
}
