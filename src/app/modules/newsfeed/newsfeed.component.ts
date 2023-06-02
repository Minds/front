import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../services/api';
import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { ContextService } from '../../services/context.service';
import { NewsfeedService } from './services/newsfeed.service';
import { PagesService } from '../../common/services/pages.service';
import { ExperimentsService } from '../experiments/experiments.service';

@Component({
  selector: 'm-newsfeed',
  templateUrl: 'newsfeed.component.html',
  styleUrls: ['newsfeed.component.ng.scss'],
})
export class NewsfeedComponent implements OnInit, OnDestroy {
  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  showRightSidebar: boolean = true;
  preventHashtagOverflow: boolean = false;

  message: string = '';
  newUserPromo: boolean = false;

  paramsSubscription: Subscription;
  urlSubscription: Subscription;

  pollingTimer: any;
  pollingOffset: string = '';
  pollingNewPosts: number = 0;

  boostFeed: boolean = false;

  subscribed: boolean = false;

  tag: string = null;

  isSorted: boolean = false;

  legacySorting: boolean = false;

  hashtag: string;

  all: boolean;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public pagesService: PagesService,
    protected storage: Storage,
    protected context: ContextService,
    protected newsfeedService: NewsfeedService
  ) {
    this.urlSubscription = this.route.url.subscribe(() => {
      this.tag = null;

      const path: string =
        route.snapshot.firstChild && route.snapshot.firstChild.routeConfig.path;
      const params: any =
        (route.snapshot.firstChild && route.snapshot.firstChild.params) || {};

      if (path === 'boost') {
        this.boostFeed = true;
      } else if (path === 'tag/:tag') {
        this.tag = route.snapshot.firstChild.url[1].path;
      } else {
      }

      this.subscribed = path === 'subscribed';

      this.legacySorting = path === 'suggested';
      this.isSorted = this.legacySorting || path === 'global/:algorithm';
      this.hashtag = params.hashtag || null;
      this.all = Boolean(params.all);
    });
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']); //force login
    }

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];

      if (params['ts']) {
        this.showBoostRotator = false;
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
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
  }

  reloadTopFeed(all: boolean = false) {
    // Legacy
    this.newsfeedService.reloadFeed(all);
    if (!this.isSorted) {
      this.router.navigate(['newsfeed/suggested']);
    }
  }

  async navigateToGlobal() {
    await this.router.navigate(['/newsfeed/global']);
  }

  hidePlusButton(event) {
    localStorage.setItem('newsfeed:hide-plus-button', 'true');
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:resize') detectWidth() {
    this.showRightSidebar = window.innerWidth >= 1100;
    this.preventHashtagOverflow = window.innerWidth < 400;
  }

  canDeactivate() {
    return true;
  }
}
