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
        case 'trending':
          this.title.setTitle('Trending Blogs');
          break;
        case 'top':
          this.filter = 'trending';
        case 'featured':
          this.title.setTitle('Featured Blogs');
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
    this.client.get('api/v1/blog/' + this.filter + '/' + this._filter2, { limit: 12, offset: this.offset })
      .then((response: MindsBlogListResponse) => {

        if (!response.blogs) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.pushToColumns(response.blogs);
        } else {
          if (this.offset)
            response.blogs.shift();
          this.pushToColumns(response.blogs);
        }

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  pushToColumns(blogs) {
    for (let i = 0; i < blogs.length; i++) {

      //0, 3, 4 takes column 0
      if (i == 0 || i == 3 || i == 4) {
        this.entities_0.push(blogs[i]);
      }

      //1, 2, 6 takes column 1
      if (i == 1 || i == 2 || i == 5) {
        this.entities_1.push(blogs[i]);
      }

      //even numbers take column 0
      if (i > 5 && i % 2 === 0) {
        this.entities_0.push(blogs[i]);
      }

      //odd numbers take column 1
      if (i > 5 && i % 2 !== 0) {
        this.entities_1.push(blogs[i]);
      } 

    }
  }

}

export { BlogView } from './view/view';
export { BlogViewInfinite } from './view/infinite';
export { BlogEdit } from './edit/edit';
