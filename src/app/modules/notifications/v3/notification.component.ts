import { isPlatformServer } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { utils } from 'ethers';
import { ActivityService } from '../../../common/services/activity.service';
import { ConfigsService } from '../../../common/services/configs.service';

import { Session } from '../../../services/session';
import { InteractionsModalService } from '../../newsfeed/interactions-modal/interactions-modal.service';
import { NotificationsV3Service } from './notifications-v3.service';

@Component({
  selector: 'm-notifications__notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.ng.scss'],
  providers: [NotificationsV3Service, ActivityService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsV3NotificationComponent
  implements AfterViewInit, OnDestroy {
  @Input() notification;

  @ViewChild('notificationWrapper') notificationWrapper: ElementRef;

  interceptionObserver: IntersectionObserver;

  constructor(
    public session: Session,
    public route: ActivatedRoute,
    private configs: ConfigsService,
    private el: ElementRef,
    private service: NotificationsV3Service,
    private cd: ChangeDetectorRef,
    private interactionsModalService: InteractionsModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    this.detectIntersecting();
  }

  ngOnDestroy(): void {
    if (this.interceptionObserver) {
      this.interceptionObserver.disconnect();
    }
  }

  async onClick(e: MouseEvent) {
    if (this.notification.type === 'subscribe') {
      e.preventDefault();
      e.stopPropagation();
      await this.interactionsModalService.open(
        'subscribers',
        this.session.getLoggedInUser().guid
      );
    }
  }

  get showFrom(): boolean {
    if (
      ['group_queue_add', 'token_rewards_summary', 'report_actioned'].indexOf(
        this.notification.type
      ) > -1
    ) {
      return false;
    }
    return true;
  }

  get verb(): string {
    switch (this.notification.type) {
      case 'vote_up':
        return 'voted up';
      case 'vote_down':
        return 'voted down';
      case 'comment':
        if (this.notification.data.is_reply) {
          return 'replied to';
        }
        return 'commented on';
      case 'tag':
        return 'tagged you in';
      case 'remind':
        return 'reminded';
      case 'quote':
        return 'quoted';
      case 'subscribe':
        return 'subscribed to you';
      case 'group_queue_add':
        return 'Your post is awaiting approval from the group administrators';
      case 'group_queue_approve':
        return 'approved';
      case 'group_queue_reject':
        return 'rejected';
      case 'group_invite':
        return 'invited you to join';
      case 'wire_received':
        return 'paid';
      case 'boost_peer_request':
        return 'sent you';
      case 'boost_peer_accepted':
        return 'accepted';
      case 'boost_peer_rejected':
        return 'declined'; // Friendlier than REJECTED
      case 'boost_rejected':
        return 'is unable to approve';
      case 'token_rewards_summary':
        return (
          'You earned ' +
          this.notification.data.tokens_formatted +
          ' tokens ($' +
          this.notification.data.usd_formatted +
          ') in rewards yesterday 🚀'
        );
      case 'report_actioned':
        return (
          'Your ' +
          (this.notification.entity?.type === 'comment' ? 'comment' : 'post') +
          ' was ' +
          this.notification.data.action
        );
    }
  }

  get pronoun(): string {
    switch (this.notification.type) {
      case 'quote':
        return 'your';
      case 'boost_peer_request':
        return 'a';
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return 'your';
      case 'wire_received':
        switch (this.notification.data.method) {
          case 'tokens':
            return (
              'you ' +
              utils.formatEther(this.notification.data.amount) +
              ' ' +
              this.notification.data.method
            );
          case 'usd':
            const cents = this.notification.data.amount;
            const usd = Math.round(this.notification.data.amount / 100);
            return 'you $' + usd;
        }
      case 'subscribe':
      case 'group_queue_add':
      case 'group_invite':
      case 'token_rewards_summary':
      case 'report_actioned':
        return '';
    }

    return this.notification.entity?.owner_guid ==
      this.session.getLoggedInUser().guid
      ? 'your'
      : 'their';
  }

  get noun(): string {
    switch (this.notification.type) {
      case 'wire_received':
      case 'group_queue_add':
      case 'token_rewards_summary':
      case 'report_actioned':
      case 'subscribe':
        return '';
      case 'boost_peer_request':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return 'boost offer';
      case 'boost_rejected':
        return 'boost';
    }
    switch (this.notification.entity?.type) {
      case 'comment':
        return 'comment';
      case 'object':
        return this.notification.entity?.subtype;
      case 'user':
        return 'you';
      case 'group':
        return this.notification.entity.name;
      default:
        return 'post';
    }
  }

  get nounLink() {
    switch (this.notification.type) {
      case 'boost_peer_request':
        return ['/boost/console/offers/history/inbox'];
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return ['/boost/console/offers/history/outbox'];
      case 'subscribe':
        return ['/' + this.notification.from.username];
      case 'group_invite':
        return ['/groups/profile/' + this.notification.entity.guid];
    }

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
   * Returns the entity object
   */
  get entity(): Object | null {
    switch (this.notification.type) {
      case 'token_rewards_summary':
        return null;
      case 'boost_peer_request':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return this.notification.entity.entity;
    }
    return this.notification.entity;
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
      threshold: 0,
    };

    this.interceptionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.service.markAsRead(this.notification);
          }
        });
      },
      options
    );

    this.interceptionObserver.observe(this.notificationWrapper.nativeElement);
  }
}
