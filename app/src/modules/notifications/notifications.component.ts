import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api/client';
import { SessionFactory } from '../../services/session';
import { NotificationService } from './notification.service';

@Component({
  moduleId: module.id,
  selector: 'minds-notifications',
  templateUrl: 'notifications.component.html'
})

export class NotificationsComponent {
  @Input() params: any;
  notifications: Array<Object> = [];
  entity;
  moreData: boolean = true;
  offset: string = '';
  inProgress: boolean = false;
  session = SessionFactory.build();
  _filter: string = 'all';
  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public router: Router,
    public title: MindsTitle,
    public notificationService: NotificationService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this._filter = params['filter'];
        this.notifications = [];
        this.load(true);
      }
      if (params['ts']) {
        this.notifications = [];
        this.load(true);
        this.notificationService.clear();
      }
    });

    this.load(true);

    this.notificationService.clear();
    this.title.setTitle('Notifications');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {
    var self = this;

    if (this.inProgress) return false;

    if (refresh)
      this.offset = '';

    this.inProgress = true;

    this.client.get(`api/v1/notifications/${this._filter}`, { limit: 24, offset: this.offset })
      .then((data: any) => {

        if (!data.notifications) {
          self.moreData = false;
          self.inProgress = false;
          return false;
        }

        if (refresh) {
          self.notifications = data.notifications;
        } else {
          for (let entity of data.notifications)
            self.notifications.push(entity);
        }

        if (!data['load-next'])
          this.moreData = false;
        self.offset = data['load-next'];
        self.inProgress = false;

      });
  }

  loadEntity(entity) {
    if (entity.type === 'comment') {
      this.client.get('api/v1/entities/entity/' + entity.parent_guid)
        .then((response: any) => {
          this.entity = response.entity;
        });
    } else {
      this.entity = entity;
    }
  }

  changeFilter(filter) {
      this._filter = filter;
      this.notifications = [];
      this.load(true);
  }
}
