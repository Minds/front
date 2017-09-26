import { Component, HostListener, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Navigation as NavigationService } from '../../services/navigation';
import { MindsActivityObject } from '../../interfaces/entities';
import { SessionFactory } from '../../services/session';
import { Poster } from '../../modules/legacy/controllers/newsfeed/poster/poster';

@Component({
  selector: 'minds-newsfeed',
  templateUrl: 'list.html'
})

export class Newsfeed {

  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  session = SessionFactory.build();
  showRightSidebar: boolean = true;
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

  pollingTimer: any;
  pollingOffset: string = '';
  pollingNewPosts: number = 0;

  @ViewChild('poster') private poster: Poster;

  constructor(public client: Client, public upload: Upload, public navigation: NavigationService,
    public router: Router, public route: ActivatedRoute, public title: MindsTitle) {
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.load();
      //this.setUpPoll();
      this.minds = window.Minds;
    }

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

    this.title.setTitle('Newsfeed');
    this.detectWidth();
  }

  setUpPoll() {
    this.pollingTimer = setInterval(() => {
      this.client.get('api/v1/newsfeed', { offset: this.pollingOffset, count: true }, { cache: true })
        .then((response: any) => {
          if (typeof response.count === 'undefined') {
            return;
          }

          this.pollingNewPosts += response.count;
          this.pollingOffset = response['load-previous'];
        })
        .catch(e => { console.error('Newsfeed polling', e); });
    }, 60000);
  }

  pollingLoadNew() {
    if (!this.pollingOffset || !this.pollingNewPosts) {
      return;
    }

    if (this.pollingNewPosts > 120) { // just replace the whole newsfeed
      return this.load(true);
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed', { limit: this.pollingNewPosts, offset: this.pollingOffset, prepend: true }, { cache: true })
      .then((data: MindsActivityObject) => {
        this.inProgress = false;
        this.pollingNewPosts = 0;

        if (!data.activity) {
          return;
        }

        this.prepended = data.activity.concat(this.prepended);

        this.pollingOffset = data['load-previous'] ? data['load-previous'] : '';
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  ngOnDestroy() {
    clearInterval(this.pollingTimer);
    this.paramsSubscription.unsubscribe();
  }

  /**
   * Load newsfeed
   */
  load(refresh: boolean = false) {
    var self = this;
    if (this.inProgress) {
      //console.log('already loading more..');
      return false;
    }

    if (refresh) {
      this.offset = '';
      this.pollingOffset = '';
      this.pollingNewPosts = 0;
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed', { limit: 12, offset: this.offset }, { cache: true })
      .then((data: MindsActivityObject) => {
        if (!data.activity) {
          self.moreData = false;
          self.inProgress = false;
          return false;
        }
        if (self.newsfeed && !refresh) {
          self.newsfeed = self.newsfeed.concat(data.activity);
        } else {
          self.newsfeed = data.activity;

          if (data['load-previous']) {
            self.pollingOffset = data['load-previous'];
          }
        }
        self.offset = data['load-next'];
        self.inProgress = false;
      })
      .catch(function (e) {
        self.inProgress = false;
      });
  }

  prepend(activity: any) {
    if (this.newUserPromo) {
      this.autoBoost(activity);
      activity.boostToggle = false;
      activity.boosted = true;
    }
    this.prepended.unshift(activity);
    this.pollingOffset = activity.guid;

    this.newUserPromo = false;
  }

  autoBoost(activity: any) {
    this.client.post('api/v1/boost/activity/' + activity.guid + '/' + activity.owner_guid,
      {
        newUserPromo: true,
        impressions: 200,
        destination: 'Newsfeed'
      });
  }

  delete(activity) {
    let i: any;
    for (i in this.newsfeed) {
      if (this.newsfeed[i] === activity)
        this.newsfeed.splice(i, 1);
    }
  }

  @HostListener('window:resize') detectWidth() {
    if (window.innerWidth < 1200)
      this.showRightSidebar = false;
    else
      this.showRightSidebar = true;
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

export { NewsfeedSingle } from './single/single';
