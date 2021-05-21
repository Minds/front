import { isPlatformServer } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
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

  interceptionObserver: IntersectionObserver;

  constructor(
    public session: Session,
    public route: ActivatedRoute,
    private configs: ConfigsService,
    private el: ElementRef,
    private service: NotificationsV3Service,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.detectIntersecting();
  }

  ngOnDestroy(): void {
    if (this.interceptionObserver) {
      this.interceptionObserver.disconnect();
    }
  }

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
      case 'remind':
        return 'reminded';
      case 'quote':
        return 'quoted';
      case 'subscribe':
        return 'subscribed to';
    }
  }

  get pronoun(): string {
    if (this.notification.type === 'quote') {
      return 'your';
    }
    if (this.notification.type === 'subscribe') {
      return '';
    }
    return this.notification.entity?.owner_guid ==
      this.session.getLoggedInUser().guid
      ? 'your'
      : 'their';
  }

  get noun(): string {
    switch (this.notification.entity?.type) {
      case 'comment':
        return 'comment';
      case 'object':
        return this.notification.entity?.subtype;
      case 'user':
        return 'you';
      default:
        return 'post';
    }
  }

  get nounLink() {
    switch (this.notification.entity?.type) {
      case 'comment':
        return ['/newsfeed/', this.notification.entity.entity_guid]; // TODO make this have the focused query param
      default:
        return ['/newsfeed', this.notification.entity?.guid];
    }
  }

  get nounLinkParams(): Object | null {
    if (this.notification.type === 'comment') {
      return {
        focusedCommentUrn: this.notification.data.comment_urn,
      };
    }

    if (this.notification.entity?.type === 'comment') {
      return {
        focusedCommentUrn: this.notification.entity.urn,
      };
    }

    return null;
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

  /**
   * Will mark as read if intersecting
   */
  protected detectIntersecting(): void {
    if (!this.notification) return;
    if (isPlatformServer(this.platformId)) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.interceptionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          console.log(entry.isIntersecting);
          this.service.markAsRead(this.notification);
        });
      },
      options
    );

    this.interceptionObserver.observe(this.el.nativeElement);
  }
}
