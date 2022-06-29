import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { FeaturesService } from '../../../services/features.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { ExperimentsService } from '../../experiments/experiments.service';

@Component({
  selector: 'm-newsfeed--boost',
  templateUrl: 'boost.component.html',
  providers: [FeedsService],
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

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private storage: Storage,
    private context: ContextService,
    private experiments: ExperimentsService,
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

    let params = {
      boostfeed: true,
    };

    params['show_boosts_after_x'] = 604800; // 1 week

    this.feedsService
      .setEndpoint('api/v2/boost/feed')
      .setParams(params)
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
