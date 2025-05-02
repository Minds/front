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
import { formatEther } from 'ethers';
import { ActivityService } from '../../../common/services/activity.service';
import { ConfigsService } from '../../../common/services/configs.service';

import { Session } from '../../../services/session';
import { BoostLocation } from '../../boost/modal-v2/boost-modal-v2.types';
import { InteractionsModalService } from '../../newsfeed/interactions-modal/interactions-modal.service';
import { NotificationsV3Service } from './notifications-v3.service';
import { getGiftCardProductLabelEnum } from './enums/gift-card-product-label.enum';
import truncateString from '../../../helpers/truncate-string';

@Component({
  selector: 'm-notifications__notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.ng.scss'],
  providers: [NotificationsV3Service, ActivityService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsV3NotificationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() notification;

  @ViewChild('notificationWrapper') notificationWrapper: ElementRef;

  intersectionObserver: IntersectionObserver;

  /** show a warning error if the notification type is not recognised */
  typeError: boolean = false;

  private senderDetails: Map<string, any> = null;

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
      case 'group_queue_received':
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
      case 'boost_accepted':
      case 'boost_rejected':
      case 'boost_completed':
      //
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      //
      case 'report_actioned':
      // case 'chat_invite':
      //
      case 'supermind_created':
      case 'supermind_rejected':
      case 'supermind_accepted':
      case 'supermind_expiring_soon':
      // case 'supermind_expired':
      //
      case 'post_subscription':
      //
      case 'gift_card_recipient_notified':
      case 'gift_card_claimed_issuer_notified':
        return;

      case 'affiliate_earnings_deposited':
      case 'referrer_affiliate_earnings_deposited':
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
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
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
      case 'group_queue_received':
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      case 'report_actioned':
      case 'wire_payout':
      case 'boost_accepted':
      case 'boost_completed':
      case 'boost_rejected':
      case 'supermind_expiring_soon':
      case 'affiliate_earnings_deposited':
      case 'referrer_affiliate_earnings_deposited':
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
      case 'group_queue_received':
        return 'Post pending approval in';
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
      case 'boost_accepted':
        return 'Your Boost is now running';
      case 'boost_rejected':
        return 'Your Boost was rejected';
      case 'boost_completed':
        return 'Your Boost is complete';
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
      case 'supermind_accepted':
        return ' has replied to';
      case 'supermind_created':
        return ' sent you';
      case 'supermind_rejected':
        return ' has declined';
      case 'supermind_expiring_soon':
        return "Don't forget to review";
      case 'gift_card_recipient_notified':
        return 'sent';
      case 'gift_card_claimed_issuer_notified':
        return 'claimed';
      case 'affiliate_earnings_deposited':
      case 'referrer_affiliate_earnings_deposited':
        return `You earned $${this.data.amount_usd} from Minds Affiliate Program`;
      case 'post_subscription':
        return 'created a new';
    }
  }

  get pronoun(): string {
    switch (this.notification.type) {
      case 'supermind_created':
      case 'boost_peer_request':
        return 'a';
      case 'supermind_accepted':
      case 'supermind_rejected':
      case 'quote':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
      case 'gift_card_claimed_issuer_notified':
        return 'your';
      case 'group_queue_reject':
        return 'your post at';
      case 'wire_received':
        return 'you ' + this.formatWireAmount(this.notification);
      case 'wire_payout':
      case 'subscribe':
      case 'group_queue_add':
      case 'group_queue_received':
      case 'group_invite':
      case 'token_rewards_summary':
      case 'token_withdraw_accepted':
      case 'token_withdraw_rejected':
      case 'report_actioned':
      case 'boost_completed':
      case 'boost_accepted':
      case 'boost_rejected':
      case 'supermind_expiring_soon':
      case 'affiliate_earnings_deposited':
      case 'referrer_affiliate_earnings_deposited':
        return '';
      case 'gift_card_recipient_notified':
        return 'you';
      case 'post_subscription':
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
      case 'boost_accepted':
      case 'boost_rejected':
      case 'affiliate_earnings_deposited':
      case 'referrer_affiliate_earnings_deposited':
        return '';
      case 'boost_peer_request':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return 'boost offer';
      case 'supermind_accepted':
      case 'supermind_rejected':
      case 'supermind_created':
        return 'Supermind offer';
      case 'supermind_expiring_soon':
        return (
          this.notification.entity?.entity?.ownerObj?.name +
          "'s Supermind offer"
        );
      case 'group_queue_received':
        let groupName: string = this.notification?.entity?.name ?? 'your group';
        if (groupName.length > 30) {
          groupName = groupName.substring(0, 27) + '...';
        }
        return groupName;
      case 'gift_card_recipient_notified':
        return `a gift for ${getGiftCardProductLabelEnum(
          this.notification.data.gift_card.productId
        )}`;
      case 'gift_card_claimed_issuer_notified':
        return `gift for ${getGiftCardProductLabelEnum(
          this.notification.data.gift_card.productId
        )}`;
      case 'post_subscription':
        return 'post';
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
      case 'boost_accepted':
      case 'boost_completed':
      case 'boost_rejected':
        return [`/boost/boost-console`];
      // case 'boost_rejected':
      //   return ['/boost/console/newsfeed/history'];
      case 'token_rewards_summary':
        return ['/wallet/tokens/rewards'];
      case 'subscribe':
        return ['/' + this.notification.from.username];
      case 'group_invite':
      case 'group_queue_reject':
        return ['/group/' + this.notification.entity.guid];
      case 'group_queue_received':
        return [`/group/${this.notification.entity.guid}/review`];
      case 'wire_received':
      case 'wire_payout':
        return [`/wallet/${this.notification.data.method}/transactions`];
      case 'supermind_rejected':
      case 'supermind_created':
      case 'supermind_expired':
      case 'supermind_expiring_soon':
        return [`/supermind/${this.notification.entity?.guid}`];
      case 'supermind_accepted':
        return ['/newsfeed', this.notification.entity?.reply_activity_guid];
      case 'gift_card_recipient_notified':
        return [
          '/gift-cards/claim/',
          this.notification.data.gift_card.claimCode,
        ];
      case 'gift_card_claimed_issuer_notified':
        return ['/settings/payments/payment-history'];
      case 'affiliate_earnings_deposited':
      case 'referrer_affiliate_earnings_deposited':
        return ['/wallet/cash/earnings'];
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

    if (
      this.notification.type === 'boost_accepted' ||
      this.notification.type === 'boost_completed' ||
      this.notification.type === 'boost_rejected'
    ) {
      return {
        boostGuid: this.notification.entity?.guid,
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
    switch (this.notification.type) {
      case 'gift_card_recipient_notified':
        return (
          this.configs.get('cdn_url') +
          'icon/' +
          this.notification.data.sender.guid +
          '/medium/' +
          this.notification.data.sender.icontime
        );
      default:
        const currentUser = this.session.getLoggedInUser();
        const fromGuid: string = this.notification.from.guid;
        const iconTime: number =
          currentUser && currentUser.guid === fromGuid
            ? currentUser.icontime
            : this.notification.from.icontime;
        return (
          this.configs.get('cdn_url') +
          'icon/' +
          fromGuid +
          '/medium/' +
          iconTime
        );
    }
  }

  public getNotificationSenderDetails(): Map<string, any> {
    if (this.senderDetails) {
      return this.senderDetails;
    }

    this.senderDetails = new Map<string, any>();
    switch (this.notification.type) {
      case 'gift_card_recipient_notified':
        this.senderDetails.set(
          'username',
          this.notification.data.sender.username
        );
        this.senderDetails.set(
          'name',
          truncateString(this.notification.data.sender.name, 20)
        );
        break;
      case 'gift_card_claimed_issuer_notified':
        this.senderDetails.set(
          'username',
          this.notification.data.claimant.username
        );
        this.senderDetails.set(
          'name',
          truncateString(this.notification.data.claimant.name, 20)
        );
        break;
      default:
        this.senderDetails.set('username', this.notification.from.username);
        this.senderDetails.set('name', this.notification.from.name);
    }

    this.senderDetails.set('avatarUrl', this.avatarUrl);

    return this.senderDetails;
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
      case 'group_queue_received':
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
      case 'boost_accepted':
      case 'boost_peer_request':
      case 'boost_peer_rejected':
      case 'boost_peer_accepted':
        return 'trending_up';
      case 'supermind_rejected':
      case 'supermind_created':
      case 'supermind_expired':
      case 'supermind_expiring_soon':
        return 'tips_and_updates';
      case 'gift_card_recipient_notified':
      case 'gift_card_claimed_issuer_notified':
        return 'redeem';
      case 'post_subscription':
        return 'notifications';
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
        return this.notification.entity.entity;
    }
    return this.notification.entity;
  }

  get data(): any | null {
    return this.notification.data;
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
      this.notification.type !== 'wire_payout' &&
      this.notification.type !== 'supermind_created' &&
      this.notification.type !== 'supermind_rejected' &&
      this.notification.type !== 'supermind_accepted' &&
      this.notification.type !== 'supermind_expired' &&
      this.notification.type !== 'supermind_expiring_soon' &&
      this.notification.type !== 'boost_accepted' &&
      this.notification.type !== 'boost_rejected' &&
      this.notification.type !== 'boost_completed' &&
      this.notification.type !== 'group_queue_received'
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

    this.intersectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.service.markAsRead(this.notification);
          }
        });
      },
      options
    );

    this.intersectionObserver.observe(this.notificationWrapper.nativeElement);
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
    const readableTokens = formatEther(tokens);
    const method = readableTokens === '1' ? ' token' : ' tokens';

    return readableTokens + method;
  }
}
