import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { LoginReferrerService } from '../../services/login-referrer.service';

@Component({
  selector: 'm-homepage',
  templateUrl: 'homepage.component.html'
})

export class HomepageComponent {

  videos: Array<any> = [];
  blogs: Array<any> = [];
  channels: Array<any> = [];
  stream = {
    1: [],
    2: [],
    3: []
  };
  offset: string = '';
  inProgress: boolean = false;
  videoError: boolean = false;

  minds = window.Minds;

  flags = {
    canPlayInlineVideos: true
  };

  constructor(
    public client: Client,
    public title: MindsTitle,
    public router: Router,
    public navigation: NavigationService,
    private loginReferrer: LoginReferrerService,
    public session: Session
  ) {
    this.title.setTitle('Home');
    this.loadStream();
    //this.loadVideos();
    //this.loadBlogs();

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }

  loadStream(refresh: boolean = false) {
    this.inProgress = true;
    this.client.get('api/v1/newsfeed/featured', { limit: 24, offset: this.offset })
      .then((response: any) => {
        let col = 0;
        for (let activity of response.activity) {
          //split stream into 3 columns
          if (col++ >= 3)
            col = 1;
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
    this.client.get('api/v1/entities/featured/videos', { limit: 4 })
      .then((response: any) => {
        this.videos = response.entities;
      });
  }

  loadBlogs() {
    this.client.get('api/v1/blog/featured', { limit: 4 })
      .then((response: any) => {
        this.blogs = response.blogs;
      });
  }

  registered() {
    this.loginReferrer.navigate({
      defaultUrl: '/' + this.session.getLoggedInUser().username + ';onboarding=1'
    });
  }

}
