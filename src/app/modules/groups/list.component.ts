import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';
import { MindsGroupListResponse } from '../../interfaces/responses';
import { ContextService } from '../../services/context.service';

@Component({
  selector: 'm-groups--list',
  templateUrl: 'list.component.html'
})

export class GroupsListComponent {

  minds;

  moreData: boolean = true;
  inProgress: boolean = false;
  offset: string = '';
  entities: Array<any> = [];
  filter: string = 'top';
  paramsSubscription: Subscription;
  rating: number = 1; 

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private context: ContextService,
    public session: Session
  ) {
  }

  ngOnInit() {
    this.title.setTitle('Groups');
    this.context.set('group');
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this.filter = params['filter'];

        this.inProgress = false;
        this.moreData = true;
        this.entities = [];
        
        if (this.session.isLoggedIn())
          this.rating = this.session.getLoggedInUser().boost_rating;
        
        this.load(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  load(refresh: boolean = false) {
    if (this.inProgress)
      return;

    if (refresh)
      this.offset = '';

    let endpoint, key;

    switch (this.filter) {
      case 'top':
        endpoint = `api/v1/entities/trending/groups`;
        key = 'entities';
        break;
      default:
        endpoint = `api/v1/groups/${this.filter}`;
        key = 'groups';
        break;
    }

    this.inProgress = true;
    this.client.get(endpoint, { 
        limit: 12, 
        offset: this.offset,
        rating: this.rating
      })
      .then((response: MindsGroupListResponse) => {

        if (!response[key] || response[key].length === 0) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.entities = response[key];
        } else {
          if (this.offset)
            response[key].shift();

          this.entities.push(...response[key]);
        }

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

  onOptionsChange(e: { rating }) {
    this.rating = e.rating;

    if (this.inProgress) {
      return setTimeout(() => {
        this.onOptionsChange(e);
      }, 100); //keep trying every 100ms
    }
    this.load(true);
  }
}

export { GroupsProfile } from './profile/profile';
export { GroupsCreator } from './create/create';
