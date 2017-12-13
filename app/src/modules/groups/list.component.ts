import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

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
  filter: string = 'featured';
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
    this.title.setTitle('Groups');
    this.context.set('group');
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this.filter = params['filter'];

        switch (this.filter) {
          case 'top':
            this.filter = 'featured';
            break;
        }

        this.inProgress = false;
        this.offset = '';
        this.moreData = true;
        this.entities = [];

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
    let endpoint, key;

    switch (this.filter) {
      case 'trending':
        endpoint = `api/v1/entities/${this.filter}/groups`;
        key = 'entities';
        break;
      default:
        endpoint = `api/v1/groups/${this.filter}`;
        key = 'groups';
        break;
    }

    if (this.inProgress)
      return;

    this.inProgress = true;
    this.client.get(endpoint, { limit: 12, offset: this.offset })
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
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }
}

export { GroupsProfile } from './profile/profile';
export { GroupsCreator } from './create/create';
