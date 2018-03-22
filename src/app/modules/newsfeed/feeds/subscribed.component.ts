import { Component, HostListener, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { MindsTitle } from '../../../services/ux/title';
import { Navigation as NavigationService } from '../../../services/navigation';
import { MindsActivityObject } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { Poster } from '../../../modules/legacy/controllers/newsfeed/poster/poster';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'm-newsfeed--subscribed',
  templateUrl: 'subscribed.component.html'
})

export class NewsfeedSubscribedComponent {

  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  minds;

  attachment_preview;

  message: string = '';
  newUserPromo: boolean = false;
  postMeta: any = {
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    active: false,
    attachment_guid: null
  };

  paramsSubscription: Subscription;

  @ViewChild('poster') private poster: Poster;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private storage: Storage,
    private context: ContextService,
    private session: Session,
  ) {
    this.title.setTitle('Newsfeed');
  }

  ngOnInit() {
    this.load();
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];

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

  /**
   * Load newsfeed
   */
  load(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh) {
      this.offset = '';
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed', { limit: 12, offset: this.offset }, { cache: true })
      .then((data: MindsActivityObject) => {
        if (!data.activity) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }
        if (this.newsfeed && !refresh) {
          this.newsfeed = this.newsfeed.concat(data.activity);
        } else {
          this.newsfeed = data.activity;
        }
        this.offset = data['load-next'];
        this.inProgress = false;
      })
      .catch(function (e) {
        this.inProgress = false;
      });
  }

  prepend(activity: any) {
    if (this.newUserPromo) {
      this.autoBoost(activity);
      activity.boostToggle = false;
      activity.boosted = true;
    }
    this.prepended.unshift(activity);

    this.newUserPromo = false;
  }

  autoBoost(activity: any) {
    this.client.post('api/v2/boost/activity/' + activity.guid + '/' + activity.owner_guid,
      {
        newUserPromo: true,
        impressions: 200,
        destination: 'Newsfeed'
      });
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

  canDeactivate() {
    if (!this.poster || !this.poster.attachment)
      return true;
    const progress = this.poster.attachment.getUploadProgress();
    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }

}

