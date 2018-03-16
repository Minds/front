import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { ContextService } from '../../services/context.service';

@Component({
  moduleId: module.id,
  selector: 'm-channels--list',
  templateUrl: 'list.component.html'
})

export class ChannelsListComponent {

  filter: string = 'top';
  uri: string = 'entities/trending/channels';
  entities: Array<Object> = [];
  moreData: boolean = true;
  offset: string | number = '';
  inProgress: boolean = false;
  paramsSubscription: Subscription;
  rating: number = 1; //safe by default

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private context: ContextService,
    public session: Session
  ) { }

  ngOnInit() {
    this.title.setTitle('Channels');

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['filter']) {
        this.filter = params['filter'];

        switch (this.filter) {
          case 'all':
            this.filter = 'all';
            break;
          case 'top':
            this.filter = 'trending';
            this.uri = 'entities/trending/channels';
            break;
          case 'subscribers':
            this.uri = 'subscribe/subscribers/' + this.session.getLoggedInUser().guid;
            break;
          case 'subscriptions':
            this.uri = 'subscribe/subscriptions/' + this.session.getLoggedInUser().guid;
            break;
        }
      }

      this.inProgress = false;
      this.entities = [];
      this.load(true);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {

    if (this.inProgress || !this.moreData && !refresh)
      return false;

    if (refresh)
      this.offset = '';

    this.inProgress = true;

    this.client.get('api/v1/' + this.uri, {
        limit: 24,
        offset: this.offset
      })
      .then((data: any) => {
        if (data.users)
          data.entities = data.users;
        if (!data.entities) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.entities = data.entities;
        } else {
          if (this.offset)
            data.entities.shift();
          this.entities = this.entities.concat(data.entities);
        }

        this.offset = data['load-next'];
        if (!this.offset)
          this.moreData = false;
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
