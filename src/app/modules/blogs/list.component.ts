import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { MindsBlogListResponse } from '../../interfaces/responses';
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
        case 'top':
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
      this.offset = '';
      this.moreData = true;
      this.entities_0 = [];
      this.entities_1 = [];

      if (this.session.isLoggedIn())
        this.rating = this.session.getLoggedInUser().boost_rating;

      this.load();
    });
    this.context.set('object:blog');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    this.inProgress = true;
    this.client.get('api/v1/blog/' + this.filter + '/' + this._filter2, { 
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

        if (refresh) {
          this.pushToColumns(response.entities);
        } else {
          if (this.offset)
            response.entities.shift();
          this.pushToColumns(response.entities);
        }

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
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
