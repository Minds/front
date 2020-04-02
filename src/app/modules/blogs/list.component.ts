import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { ContextService } from '../../services/context.service';
import { HashtagsSelectorModalComponent } from '../hashtags/hashtag-selector-modal/hashtags-selector.component';
import { OverlayModalService } from '../../services/ux/overlay-modal';

@Component({
  moduleId: module.id,
  selector: 'm-blog--list',
  templateUrl: 'list.component.html',
})
export class BlogListComponent {
  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;
  entities_0: Array<any> = [];
  entities_1: Array<any> = [];
  filter: string = 'featured';
  _filter2: string = '';
  paramsSubscription: Subscription;
  rating: number = 1; //show safe by default
  all: boolean = false;

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    public router: Router,
    private context: ContextService,
    public session: Session,
    private overlayModal: OverlayModalService
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.filter = params['filter'];

      switch (this.filter) {
        case 'network':
          this.filter = 'network';
          break;
        case 'trending':
          break;
        case 'top':
          this.router.navigate(['/newsfeed/global/top', { type: 'blogs' }]);

          // if (!this.session.isLoggedIn()) {
          //   this.router.navigate(['/login']);
          // }
          // this.filter = 'trending';
          break;
        case 'suggested':
          if (!this.session.isLoggedIn()) {
            this.router.navigate(['/login']);
          }
          this.filter = 'trending';
        case 'featured':
          break;
        case 'all':
          break;
        case 'owner':
          break;
        case 'my':
          this._filter2 = this.session.getLoggedInUser().guid;
          this.filter = 'owner';
          break;
        default:
          this._filter2 = this.filter;
          this.filter = 'owner';
      }

      this.inProgress = false;
      this.moreData = true;
      this.entities_0 = [];
      this.entities_1 = [];

      if (this.session.isLoggedIn())
        this.rating = this.session.getLoggedInUser().boost_rating;

      this.load(true);
    });
    this.context.set('object:blog');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  reloadTags(all: boolean = false) {
    this.all = all;
    this.load(true);
  }

  load(refresh: boolean = false) {
    if (this.inProgress) return false;

    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.entities_0 = [];
      this.entities_1 = [];
    }

    this.inProgress = true;
    let endpoint;

    if (this.filter === 'trending') {
      endpoint = 'api/v2/entities/suggested/blogs';
      if (this.all) endpoint += '/all';
    } else {
      endpoint = 'api/v1/blog/' + this.filter + '/' + this._filter2;
    }
    this.client
      .get(endpoint, {
        limit: 12,
        offset: this.offset,
        rating: this.rating,
      })
      .then((response: any) => {
        if (!response.entities || !response.entities.length) {
          this.moreData = false;
          this.inProgress = false;

          if (this.filter == 'trending' && !this.offset)
            this.openHashtagsSelector();
          return false;
        }

        this.pushToColumns(response.entities);

        this.offset = response['load-next'];
        if (!this.offset) {
          this.moreData = false;
        }
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  reloadTopFeed() {
    this.load(true);
  }

  onOptionsChange(e: { rating }) {
    this.rating = e.rating;

    if (this.inProgress) {
      return setTimeout(() => {
        this.onOptionsChange(e);
      }, 100); //keep trying every 100ms
    }
    this.load(true);
  }

  openHashtagsSelector() {
    this.overlayModal
      .create(
        HashtagsSelectorModalComponent,
        {},
        {
          class:
            'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large',
          onSelected: () => {
            this.load(true); //refresh list
          },
        }
      )
      .present();
  }

  pushToColumns(blogs) {
    let listLength = this.entities_0.length + this.entities_1.length;

    for (let i = 0; i < blogs.length; i++) {
      let index = i + listLength;
      if (index <= 5) {
        if (index == 0 || index == 3 || index == 4) {
          this.entities_0.push(blogs[i]);
        } else {
          this.entities_1.push(blogs[i]);
        }
      } else {
        //even numbers take column 0
        if (index % 2 == 0) {
          this.entities_0.push(blogs[i]);
        } else {
          this.entities_1.push(blogs[i]);
        }
      }
    }
  }
}

export { BlogView } from './view/view';
export { BlogViewInfinite } from './view/infinite';
export { BlogEdit } from './edit/edit';
