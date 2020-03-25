import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { PosterComponent } from '../poster/poster.component';
import { FeaturesService } from '../../../services/features.service';
import { FeedsService } from '../../../common/services/feeds.service';

@Component({
  selector: 'm-newsfeed--boost',
  templateUrl: 'boost.component.html',
})
export class NewsfeedBoostComponent {
  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  exclude: string[] = [];
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;

  message: string = '';

  paramsSubscription: Subscription;

  boostFeed: boolean = false;

  @ViewChild('poster', { static: false }) private poster: PosterComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private storage: Storage,
    private context: ContextService,
    protected featuresService: FeaturesService,
    public feedsService: FeedsService
  ) {}

  ngOnInit() {
    this.load(true);

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['ts']) {
        this.showBoostRotator = false;
        this.load(true);
        setTimeout(() => {
          this.showBoostRotator = true;
        }, 300);
      }
    });

    this.context.set('activity');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async load(refresh: boolean = false) {
    if (this.inProgress) return false;

    if (refresh) {
      this.feedsService.clear();
    }

    this.feedsService
      .setEndpoint('api/v2/boost/feed')
      .setParams({
        boostfeed: true,
      })
      .setLimit(6)
      .setOffset(0)
      .fetch();
  }

  loadNext() {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  delete(activity) {
    let i: any;
    for (i in this.prepended) {
      if (this.prepended[i] === activity) {
        this.prepended.splice(i, 1);
        return;
      }
    }
    for (i in this.newsfeed) {
      if (this.newsfeed[i] === activity) {
        this.newsfeed.splice(i, 1);
        return;
      }
    }
  }
}
