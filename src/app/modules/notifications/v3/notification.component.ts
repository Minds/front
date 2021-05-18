import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';

import { Session } from '../../../services/session';
import { NotificationsV3Service } from './notifications-v3.service';

@Component({
  selector: 'm-notifications__notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.ng.scss'],
  providers: [NotificationsV3Service],
})
export class NotificationsV3NotificationComponent implements OnInit, OnDestroy {
  @Input() notification;

  constructor(
    public session: Session,
    private service: NotificationsV3Service,
    public route: ActivatedRoute,
    private configs: ConfigsService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  get verb(): string {
    switch (this.notification.type) {
      case 'vote_up':
        return 'voted up';
      case 'vote_down':
        return 'voted down';
      case 'comment':
        return 'commented on';
      case 'tag':
        return 'tagged you in';
    }
  }

  get adjective(): string {
    return this.notification.entity?.owner_guid ==
      this.session.getLoggedInUser().guid
      ? 'your'
      : 'their';
  }

  get noun(): string {
    switch (this.notification.entity?.type) {
      case 'comment':
        return 'comment';
      default:
        return 'post';
    }
  }

  get nounLink() {
    switch (this.notification.entity?.type) {
      case 'comment':
        return ['/newsfeed/', this.notification.entity.entity_guid]; // TODO make this have the focused query param
      default:
        return ['/newsfeed', this.notification.entity.guid];
    }
  }

  /**
   * Return the avatar url
   * TODO: Backend should really be doing this?
   * @return string
   */
  get avatarUrl(): string {
    const currentUser = this.session.getLoggedInUser();
    const fromGuid: string = this.notification.from.guid;
    const iconTime: number =
      currentUser && currentUser.guid === fromGuid
        ? currentUser.icontime
        : this.notification.from.icontime;
    return (
      this.configs.get('cdn_url') + 'icon/' + fromGuid + '/medium/' + iconTime
    );
  }
}
