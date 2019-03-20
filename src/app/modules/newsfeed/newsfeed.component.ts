import { Component, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { OverlayModalService } from '../../services/ux/overlay-modal';
import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Navigation as NavigationService } from '../../services/navigation';
import { MindsActivityObject } from '../../interfaces/entities';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { ContextService } from '../../services/context.service';
import { PosterComponent } from './poster/poster.component';
import { NewsfeedService } from './services/newsfeed.service';
import { SideBarSelectorChange } from "../hashtags/sidebar-selector/sidebar-selector.component";
import { NewsfeedHashtagSelectorService } from "./services/newsfeed-hashtag-selector.service";

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
  preventHashtagOverflow: boolean = false;
  minds;

  message: string = '';
  newUserPromo: boolean = false;

  paramsSubscription: Subscription;
  urlSubscription: Subscription;

  pollingTimer: any;
  pollingOffset: string = '';
  pollingNewPosts: number = 0;

  boostFeed: boolean = false;

  showPlusButton: boolean = true;

  subscribed: boolean = false;

  tag: string = null;

  isSorted: boolean = false;

  legacySorting: boolean = false;

  hashtag: string;

  all: boolean;

  @ViewChild('poster') private poster: PosterComponent;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    protected storage: Storage,
    protected overlayModal: OverlayModalService,
    protected context: ContextService,
    protected newsfeedService: NewsfeedService,
    protected newsfeedHashtagSelectorService: NewsfeedHashtagSelectorService,
  ) {

    this.urlSubscription = this.route.url.subscribe(() => {
      this.tag = null;

      const path: string = route.snapshot.firstChild && route.snapshot.firstChild.routeConfig.path;
      const params: any = (route.snapshot.firstChild && route.snapshot.firstChild.params) || {};

      if (path === 'boost') {
        this.title.setTitle('Boost Newsfeed');
        this.boostFeed = true;
      } else if (path === 'tag/:tag') {
        this.tag = route.snapshot.firstChild.url[1].path;
      } else {
        this.title.setTitle('Newsfeed');
      }

      this.subscribed = path === 'subscribed';

      this.legacySorting = path === 'suggested';
      this.isSorted = this.legacySorting || path === 'global/:algorithm';
      this.hashtag = params.hashtag || null;
      this.all = Boolean(params.all);
    });

    const showPlusButton = localStorage.getItem('newsfeed:hide-plus-button');
    if (showPlusButton != null) {
      this.showPlusButton = false
    }
  }

  ngOnInit() {

    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']); //force login
    } else {
      this.load();
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

  reloadTopFeed(all: boolean = false) {
    // Legacy
    this.newsfeedService.reloadFeed(all);
    if (!this.isSorted) {
      this.router.navigate(['newsfeed/suggested']);
    }
  }

  async hashtagFilterChange(filter: SideBarSelectorChange) {
    if (!this.isSorted && !this.legacySorting) {
      switch (filter.type) {
        case 'single':
          await this.router.navigate(['/newsfeed/global/hot', { hashtag: filter.value }]);
          break;

        case 'preferred':
          await this.router.navigate(['/newsfeed/global/hot']);
          break;

        case 'all':
          await this.router.navigate(['/newsfeed/global/hot', { all: 1 }]);
          break;
      }
    }

    this.newsfeedHashtagSelectorService.emit(filter);
  }

  async navigateToGlobal() {
    await this.router.navigate(['/newsfeed/global']);
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

  onViewed(event: { activity, visible }) {
    if (this.boostFeed) {
      if (event.visible) {
        this.client.put('api/v1/boost/fetch/newsfeed/' + event.activity.boosted_guid);
      } else {
        this.client.put('api/v1/boost/fetch/newsfeed/' + event.activity.boosted_guid + '/stop');
      }
    }
  }

  @HostListener('window:resize') detectWidth() {
    this.showRightSidebar = window.innerWidth >= 1100;
    this.preventHashtagOverflow = window.innerWidth < 400;
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

