import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../services/configs.service';
import { UserAvatarService } from '../../services/user-avatar.service';

export type PublisherCardSize = 'small' | 'medium' | 'large';
@Component({
  selector: 'm-publisherCard',
  templateUrl: './publisher-card.component.html',
  styleUrls: ['./publisher-card.component.ng.scss'],
})
export class PublisherCardComponent implements AfterViewInit {
  @Input() publisher: any;

  @Input() showDescription: boolean = true;
  @Input() showSubs: boolean = true;
  @Input() showSubscribeButton: boolean = true;

  // disable subscription - allows for a user to preview their own card.
  @Input() disableSubscribe: boolean = false;

  // @Input() showTags: boolean = false; // disabled

  // display a blue border
  @Input() featured: boolean = false;

  // Specify size
  @Input() sizeOverride: PublisherCardSize;

  readonly cdnUrl: string;
  btnIconOnly: boolean = false;
  size: PublisherCardSize = 'medium';

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
      this.showSubs = true;
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
      if (publisherCardWidth > 250) {
        this.size = 'medium';
      } else {
        this.size = 'small';
      }
    } else {
      this.size = 'large';
    }

    this.btnIconOnly = this.size === 'medium';
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
      : `/groups/profile/${this.publisher.guid}/feed`;
  }

  get subscribersUrl(): string {
    return this.type === 'user'
      ? `/${this.publisher.username}/subscribers`
      : `/groups/profile/${this.publisher.guid}/members`;
  }

  get shouldShowSubs(): boolean {
    return (
      this.showSubs &&
      this.size !== 'small' &&
      ((this.type === 'user' &&
        (this.publisher.subscribers_count ||
          this.publisher.subscriptions_count)) ||
        (this.type === 'group' && this.publisher['members:count']))
    );
  }
}
