import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { MindsTitle } from '../../../services/ux/title';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { PosterComponent } from '../poster/poster.component';
import { FeaturesService } from "../../../services/features.service";
import { BoostedContentService } from "../../../common/services/boosted-content.service";

@Component({
  selector: 'm-newsfeed--boost',
  templateUrl: 'boost.component.html'
})

export class NewsfeedBoostComponent {

  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  exclude: string[] = [];
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  minds;

  message: string = '';

  paramsSubscription: Subscription;

  boostFeed: boolean = false;

  @ViewChild('poster') private poster: PosterComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private storage: Storage,
    private context: ContextService,
    protected featuresService: FeaturesService,
    protected boostedContentService: BoostedContentService,
  ) {
    this.title.setTitle('Boost Newsfeed');
  }

  ngOnInit() {

    this.load();
    this.minds = window.Minds;

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
    if (this.featuresService.has('es-feeds')) {
      return await this.loadFromService(refresh);
    } else {
      return await this.loadLegacy(refresh);
    }
  }

  async loadFromService(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh) {
      this.exclude = [];
    }

    if (this.storage.get('boost:exclude:boostfeed')) {
      this.exclude = JSON.parse(this.storage.get('boost:exclude:boostfeed'));
    }

    try {
      const data = await this.boostedContentService.get({
        limit: 10,
        offset: 8,
        exclude: this.exclude,
        passive: true,
      });

      if (!data || !data.length) {
        this.moreData = false;
        this.inProgress = false;
        return false;
      }

      if (this.newsfeed && !refresh) {
        this.newsfeed = this.newsfeed.concat(data);
      } else {
        this.newsfeed = data.boosts;
      }

      this.exclude = this.newsfeed.map((boost: any) => boost.urn);

      this.storage.set('boost:exclude:boostfeed', this.exclude);
      this.inProgress = false;
    } catch (e) {
      if (e && e.message) {
        console.warn(e);
      }
    }

    this.inProgress = false;
  }

  async loadLegacy(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh) {
      this.offset = '';
    }

    if (this.storage.get('boost:offset:boostfeed')) {
      this.offset = this.storage.get('boost:offset:boostfeed');
    }

    this.inProgress = true;

    try {
      const data: any = await this.client.get('api/v1/boost/fetch/newsfeed', {
        limit: 12,
        offset: this.offset
      }, { cache: true });
      if (!data.boosts) {
        this.moreData = false;
        this.inProgress = false;
        return false;
      }
      if (this.newsfeed && !refresh) {
        this.newsfeed = this.newsfeed.concat(data.boosts);
      } else {
        this.newsfeed = data.boosts;
      }
      this.offset = data['load-next'];
      this.storage.set('boost:offset:boostfeed', this.offset);
      this.inProgress = false;
    } catch (e) {
      this.inProgress = false;
    }
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

