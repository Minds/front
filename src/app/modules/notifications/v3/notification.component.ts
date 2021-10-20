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
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() notification;

  @ViewChild('notificationWrapper') notificationWrapper: ElementRef;

  interceptionObserver: IntersectionObserver;

  /** show a warning error if the notification type is not recognised */
  typeError: boolean = false;

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

  ngOnInit(): void {
    if (!this.notification) return;

    /**
     * All notification types must be added to this list
     */
    switch (this.notification.type) {
      case 'vote_up':
      case 'vote_down':
      case 'comment':
      case 'tag':
      //
      case 'remind':
      case 'quote':
      //
      case 'subscribe':
      //
      case 'group_queue_add':
      case 'group_queue_approve':
      case 'group_queue_reject':
      case 'group_invite':
      //
      case 'wire_received':
      case 'wire_payout':
      //
      case 'boost_peer_request':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
      case 'boost_rejected':
      case 'boost_completed':
      //
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      //
      case 'report_actioned':
        // case 'chat_invite':
        return;
      default:
        this.typeError = true;
        console.error(
          'No template available for notification type: ' +
            this.notification.type
        );
    }
  }

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
    switch (this.notification.type) {
      case 'group_queue_add':
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      case 'report_actioned':
      case 'wire_payout':
      case 'boost_completed':
        return false;
      default:
        return true;
    }
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
        return 'declined approval of';
      case 'group_invite':
        return 'invited you to join';
      case 'wire_received':
        return 'paid';
      case 'wire_payout':
        return (
          'You received a payout of ' +
          this.formatWireAmount(this.notification) +
          ' for Minds+/Pro'
        );
      case 'boost_peer_request':
        return 'sent you';
      case 'boost_peer_accepted':
        return 'accepted';
      case 'boost_peer_rejected':
        return 'declined'; // Friendlier than REJECTED
      case 'boost_rejected':
        return 'is unable to approve';
      case 'boost_completed':
        return 'Your boost is complete';
      case 'token_rewards_summary':
        return (
          'You earned ' +
          this.notification.data.tokens_formatted +
          ' tokens ($' +
          this.notification.data.usd_formatted +
          ') in rewards yesterday 🚀'
        );
      case 'token_withdraw_accepted':
        return (
          'Your request to withdraw ' +
          this.formatTokenAmount(this.notification.data.amount) +
          ' tokens has been accepted'
        );
      case 'token_withdraw_rejected':
        return (
          'Your request to withdraw ' +
          this.formatTokenAmount(this.notification.data.amount) +
          ' tokens has been accepted'
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
      case 'boost_peer_request':
        return 'a';
      case 'quote':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
      case 'boost_rejected':
        return 'your';
      case 'group_queue_reject':
        return 'your post at';
      case 'wire_received':
        return 'you ' + this.formatWireAmount(this.notification);
      case 'wire_payout':
      case 'subscribe':
      case 'group_queue_add':
      case 'group_invite':
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      case 'report_actioned':
      case 'boost_completed':
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
      case 'wire_payout':
      case 'group_queue_add':
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      case 'report_actioned':
      case 'subscribe':
      case 'boost_completed':
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
      case 'boost_rejected':
        return ['/boost/console/newsfeed/history'];
      case 'token_rewards_summary':
        return ['/wallet/tokens/rewards'];
      case 'subscribe':
        return ['/' + this.notification.from.username];
      case 'group_invite':
      case 'group_queue_reject':
        return ['/groups/profile/' + this.notification.entity.guid];
      case 'wire_received':
      case 'wire_payout':
        return [`/wallet/${this.notification.data.method}/transactions`];
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
   * Return the iconId for the optional typeBubbleTag
   */
  get typeBubbleTag(): string | null {
    switch (this.notification.type) {
      case 'vote_up':
        return 'thumb_up';
      case 'vote_down':
        return 'thumb_down';
      case 'vote_down':
        return 'thumb_down';
      case 'comment':
        return 'chat_bubble';
      case 'tag':
        return 'local_offer';
      case 'remind':
        return 'repeat';
      case 'quote':
        return 'create';
      case 'subscribe':
        return 'person';
      case 'group_queue_add':
      case 'group_queue_approve':
      case 'group_queue_reject':
      case 'group_invite':
        return 'people';
      case 'token_rewards_summary':
        return 'account_balance';
      case 'wire_received':
        return 'attach_money';
      case 'report_actioned':
        return 'warning';
      case 'boost_rejected':
      case 'boost_completed':
      case 'boost_peer_request':
      case 'boost_peer_rejected':
      case 'boost_peer_accepted':
        return 'trending_up';
      default:
        return null;
    }
  }

  /**
   * Returns the entity object
   */
  get entity(): any | null {
    switch (this.notification.type) {
      case 'wire_payout':
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
        return null;
      case 'boost_peer_request':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
      case 'boost_rejected':
      case 'boost_completed':
        return this.notification.entity.entity;
    }
    return this.notification.entity;
  }

  /**
   * Returns whether to display a newsfeed entity
   */
  get showNewsfeedEntity(): boolean {
    return (
      this.entity &&
      this.entity?.type !== 'comment' &&
      this.entity?.type !== 'user' &&
      this.notification.type !== 'wire_received' &&
      this.notification.type !== 'wire_payout'
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

  formatWireAmount(notification): string | null {
    if (
      notification.data &&
      notification.data.method &&
      notification.data.amount
    ) {
      switch (this.notification.data.method) {
        case 'tokens':
          return this.formatTokenAmount(this.notification.data.amount);
        case 'usd':
          return '$' + (this.notification.data.amount / 100).toFixed(2);
      }
    } else {
      return;
    }
  }

  /**
   * Convert big number to a readable token amount
   */
  formatTokenAmount(tokens: string | number): string {
    const readableTokens = utils.formatEther(tokens);
    const method = readableTokens === '1' ? ' token' : ' tokens';

    return readableTokens + method;
  }
}
