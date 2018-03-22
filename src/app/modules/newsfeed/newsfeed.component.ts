import { Component, HostListener, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Navigation as NavigationService } from '../../services/navigation';
import { MindsActivityObject } from '../../interfaces/entities';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { Poster } from '../../modules/legacy/controllers/newsfeed/poster/poster';
import { ContextService } from '../../services/context.service';
import { BoostRotatorService } from './boost-rotator/boost-rotator.service';

@Component({
  selector: 'm-newsfeed',
  templateUrl: 'newsfeed.component.html'
})

export class NewsfeedComponent {

  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
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

  boostFeed: boolean = false;

  showPlusButton: boolean = true;

  subscribed: boolean = false;

  @ViewChild('poster') private poster: Poster;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private storage: Storage,
    private context: ContextService,
  ) {

    this.route.url.subscribe(segments => {
      // const path = segments[segments.length-1].path;
      const path: string = route.snapshot.firstChild && route.snapshot.firstChild.routeConfig.path;
      if(path === 'boost') {
        this.title.setTitle('Boost Newsfeed');
        this.boostFeed = true;
      } else {
        this.title.setTitle('Newsfeed');
      }

      this.subscribed = path === 'subscribed';
    });

    const showPlusButton = localStorage.getItem('newsfeed:hide-plus-button');
    if (showPlusButton != null) {
      this.showPlusButton = false
    }
  }

  ngOnInit() {

    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed/top']);
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

    this.context.set('activity');
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

  load(refresh: boolean = false) {
    if (this.boostFeed) {
      this.loadBoosts(refresh);
    } else {
      this.loadNewsfeed(refresh);
    }
  }

  /**
   * Load boost newsfeed
   */
  loadBoosts(refresh: boolean = false) {
    if (this.inProgress) {
      //console.log('already loading more..');
      return false;
    }

    if (refresh) {
      this.offset = '';
    }

    if (this.storage.get('boost:offset:boostfeed')) {
      this.offset = this.storage.get('boost:offset:boostfeed');
    }

    this.inProgress = true;

    this.client.get('api/v1/boost/fetch/newsfeed', { limit: 12, offset: this.offset }, { cache: true })
      .then((data: any) => {
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
      })
      .catch(function (e) {
        this.inProgress = false;
      });
  }

  /**
   * Load newsfeed
   */
  loadNewsfeed(refresh: boolean = false) {
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

  hidePlusButton(event) {
    this.showPlusButton = false;
    localStorage.setItem('newsfeed:hide-plus-button', 'true');
    event.preventDefault();
    event.stopPropagation();
  }

  onViewed(event: {activity, visible}) {
    if (this.boostFeed) {
      if(event.visible){
        this.client.put('api/v1/boost/fetch/newsfeed/' + event.activity.boosted_guid);
      }else {
        this.client.put('api/v1/boost/fetch/newsfeed/' + event.activity.boosted_guid + '/stop');
      }
    }
  }

  @HostListener('window:resize') detectWidth() {
    if (window.innerWidth < 1100)
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

