import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { Client } from '../../services/api';
import { LoginReferrerService } from '../../services/login-referrer.service';
import {
  GlobalScrollService,
  ScrollSubscription,
} from '../../services/ux/global-scroll.service';
import { ConfigsService } from '../../common/services/configs.service';
import { PagesService } from '../../common/services/pages.service';

@Component({
  selector: 'm-homepage',
  templateUrl: 'homepage.component.html',
})
export class HomepageComponent {
  videos: Array<any> = [];
  blogs: Array<any> = [];
  channels: Array<any> = [];
  stream = {
    1: [],
    2: [],
    3: [],
  };
  loadedStream: boolean = false;
  scroll$: [ScrollSubscription, Subscription];
  offset: string = '';
  inProgress: boolean = false;
  videoError: boolean = false;

  readonly cdnAssetsUrl: string;

  flags = {
    canPlayInlineVideos: true,
  };

  constructor(
    public client: Client,
    public router: Router,
    public navigation: NavigationService,
    private loginReferrer: LoginReferrerService,
    public session: Session,
    private scroll: GlobalScrollService,
    configs: ConfigsService,
    public pagesService: PagesService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    this.scroll$ = this.scroll.listen(
      document,
      (subscription, e) => {
        this.loadStream(true);
        this.scroll$[1].unsubscribe();
      },
      100
    );
  }

  loadStream(refresh: boolean = false) {
    this.inProgress = true;
    this.client
      .get('api/v1/newsfeed/featured', { limit: 24, offset: this.offset })
      .then((response: any) => {
        let col = 0;
        for (let activity of response.activity) {
          //split stream into 3 columns
          if (col++ >= 3) col = 1;
          this.stream[col].push(activity);
        }
        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch(() => {
        this.inProgress = false;
      });
  }

  loadVideos() {
    this.client
      .get('api/v1/entities/featured/videos', { limit: 4 })
      .then((response: any) => {
        this.videos = response.entities;
      });
  }

  loadBlogs() {
    this.client
      .get('api/v1/blog/featured', { limit: 4 })
      .then((response: any) => {
        this.blogs = response.blogs;
      });
  }

  registered() {
    this.loginReferrer.navigate({
      defaultUrl:
        '/' + this.session.getLoggedInUser().username + ';onboarding=1',
    });
  }

  onSourceError() {
    console.log('video failed');
  }
}
