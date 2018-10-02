import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { ContextService } from '../../services/context.service';

@Component({
  moduleId: module.id,
  selector: 'm-blog--list',
  templateUrl: 'list.component.html'
})

export class BlogListComponent {

  minds;

  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;
  entities_0: Array<any> = [];
  entities_1: Array<any> = [];
  filter: string = 'featured';
  _filter2: string = '';
  paramsSubscription: Subscription;
  rating: number = 1; //show safe by default

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    public router: Router,
    public title: MindsTitle,
    private context: ContextService,
    public session: Session
  ) {
  }

  ngOnInit() {
    this.title.setTitle('Blogs');
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.filter = params['filter'];

      switch (this.filter) {
        case 'network':
          this.filter = 'network';
          break;
        case 'trending':
          this.title.setTitle('Trending Blogs');
          break;
        case 'suggested':
          if (!this.session.isLoggedIn()) {
            this.router.navigate(['/login']);
          }
          this.filter = 'trending';
        case 'featured':
          this.title.setTitle('Blogs');
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

  load(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh)
      this.offset = '';

    this.inProgress = true;
    let endpoint;

    if (this.filter === 'suggested') {
      endpoint = 'api/v2/entities/suggested/blogs';
    } else {
      endpoint = 'api/v1/blog/' + this.filter + '/' + this._filter2;
    }
    this.client.get(endpoint, {
      limit: 12,
      offset: this.offset,
      rating: this.rating,
    })
      .then((response: any) => {

        if (!response.entities) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        this.pushToColumns(response.entities);

        this.offset = response['load-next'];
        if (!this.offset) {
          this.moreData = false;
        }
        this.inProgress = false;
      })
      .catch((e) => {
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
