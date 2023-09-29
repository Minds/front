import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../services/configs.service';
import { UserAvatarService } from '../../services/user-avatar.service';
import { ButtonColor, ButtonSize } from '../button/button.component';
import { MindsGroup } from '../../../modules/groups/v2/group.model';
import { GroupMembershipChangeOuput } from '../group-membership-button/group-membership-button.component';

/**
 * xsmall has no subs or descriptions
 * small removes the standalone avatar column
 */
export type PublisherCardSize = 'xsmall' | 'small' | 'medium' | 'large';

/**
 * Reusable card to display info about users/groups
 *
 * Configurable to display different types of information
 *
 * Displays differently depending on size of wrapper component
 */
@Component({
  selector: 'm-publisherCard',
  templateUrl: './publisher-card.component.html',
  styleUrls: ['./publisher-card.component.ng.scss'],
})
export class PublisherCardComponent implements AfterViewInit {
  @Input() publisher: any;

  /**
   *  Specify card size instead of using automatic calculations
   */
  @Input() sizeOverride: PublisherCardSize;

  /**
   * Don't add padding around the edge of the card
   */
  @Input() noPadding: boolean = false;

  /**
   * Don't add a border around the edge of the card
   */
  @Input() noBorder: boolean = false;

  /**
   * display a blue border
   */
  @Input() featured: boolean = false;

  /**
   * Show description
   */
  @Input() showDescription: boolean = true;

  /**
   * Show the boosted flag
   */
  @Input() showBoostedFlag: boolean = false;

  /**
   * Whether to show the subscribe or membership button
   */
  @Input() showButton: boolean = true;

  /**
   * Show this custom icon for the subscribe button after subscribing (instead of default 'close' icon)
   */
  @Input() subscribedIcon: string = 'check';

  /**
   * Show this custom icon for the membership button after joining (instead of default 'close' icon)
   */
  @Input() isMemberIcon: string = 'check';

  /**
   * Only show the secondary name row if it is a count (members/subscribers),
   * not if it is a username
   */
  @Input() secondaryRowCountsOnly: boolean = false;

  /**
   * Show only an icon for the subscribe button, regardless of card size
   */
  @Input() subscribeButtonIconOnly: boolean = false;

  @Input() membershipButtonSize: ButtonSize = 'xsmall';

  @Input() membershipButtonColor: ButtonColor = 'grey';

  /**
   * Show extra rounded border radius
   */
  @Input() curvyBorder: boolean = false;

  /**
   * Fills card with the background color of sidebar components
   */
  @Input() backgroundFill: boolean = false;

  readonly cdnUrl: string;

  buttonIconOnly: boolean = false;

  size: PublisherCardSize = 'medium';

  /**
   * Don't show subscribe button until the card size has been determined
   * to prevent flashing on resize
   */
  sized: boolean = false;

  /**
   * use channel api to double check that the subscription status is correct
   */
  recheckSubscribed: boolean = false;

  /**
   * Emit when user subscribes to a recommendation
   */
  @Output() subscribed: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emit when user unsubscribes from a recommendation
   */
  @Output() unsubscribed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected userAvatar: UserAvatarService,
    protected session: Session,
    configs: ConfigsService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  private _isHovercard: boolean;
  @Input() set isHovercard(value: boolean) {
    this._isHovercard = value;
    if (value) {
      this.recheckSubscribed = true;
      this.buttonIconOnly = true;
      this.noBorder = true;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.onResize());
    }
  }

  @ViewChild('publisherCard') publisherCardEl: ElementRef;

  @HostListener('window:resize')
  onResize() {
    if (!this.publisherCardEl || !this.publisherCardEl.nativeElement) return;

    const publisherCardWidth = this.publisherCardEl.nativeElement.offsetWidth;

    if (this.sizeOverride) {
      this.size = this.sizeOverride;
    } else if (publisherCardWidth <= 350) {
      if (publisherCardWidth > 280) {
        this.size = 'medium';
      } else if (publisherCardWidth > 250) {
        this.size = 'small';
      } else {
        this.size = 'xsmall';
      }
    } else {
      this.size = 'large';
    }

    this.buttonIconOnly = this.size === 'medium' || this.size === 'small';
    this.sized = true;
  }

  onSubscribed(publisher): void {
    this.subscribed.emit();
  }

  onUnsubscribed(publisher): void {
    this.unsubscribed.emit();
  }

  onGroupMembershipChange(
    $event: GroupMembershipChangeOuput,
    group: MindsGroup
  ) {
    if ($event.isMember) {
      this.onSubscribed(group);
    } else {
      this.onUnsubscribed(group);
    }
  }

  public getAvatarSrc(): Observable<string> {
    if (this.publisher.guid === this.session.getLoggedInUser().guid) {
      return this.userAvatar.src$;
    }

    if (this.type === 'user') {
      return of(
        `${this.cdnUrl}icon/${this.publisher.guid}/medium/${this.publisher.icontime}`
      );
    } else {
      // groups
      return of(
        `${this.cdnUrl}fs/v1/avatars/${this.publisher.guid}/${this.publisher.icontime}`
      );
    }
  }

  get type(): string {
    return this.publisher.type;
  }

  get feedUrl(): string {
    return this.type === 'user'
      ? `/${this.publisher.username}`
      : `/group/${this.publisher.guid}/feed`;
  }

  get subscribersUrl(): string {
    return this.type === 'user'
      ? `/${this.publisher.username}/subscribers`
      : `/group/${this.publisher.guid}/members`;
  }
}
