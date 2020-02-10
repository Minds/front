import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextService } from '../../../../services/context.service';
import { Upload } from '../../../../services/api/upload';
import { Client } from '../../../../services/api';
import { Navigation } from '../../../../services/navigation';
import { Storage } from '../../../../services/storage';

@Component({
  selector: 'm-newsfeed--tags',
  templateUrl: 'tags.component.html',
})
export class NewsfeedTagsComponent implements OnDestroy {
  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: number = 0;
  inProgress: boolean = false;
  moreData: boolean = true;
  paramsSubscription: Subscription;
  tag: string;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: Navigation,
    public router: Router,
    public route: ActivatedRoute,
    private storage: Storage,
    private context: ContextService
  ) {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['tag']) {
        this.tag = params['tag'];
      } else {
        this.router.navigate(['/newsfeed']);
      }
      this.load(true);
    });
    this.context.set('activity');
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  /**
   * Load newsfeed
   */
  async load(refresh: boolean = false) {
    if (this.inProgress) return false;

    if (refresh) {
      this.offset = 0;
      this.newsfeed = [];
    }

    this.inProgress = true;

    const data = {
      hashtag: this.tag,
      limit: 12,
      offset: this.offset,
    };

    try {
      const response: any = await this.client.get(
        'api/v2/entities/suggested/activities',
        data
      );

      if (!response.entities || !response.entities.length) {
        this.moreData = false;
        this.inProgress = false;
        return false;
      }

      if (this.newsfeed && !refresh) {
        this.newsfeed = this.newsfeed.concat(response.entities);
      } else {
        this.newsfeed = response.entities;
      }
      this.offset = response['load-next'];
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
