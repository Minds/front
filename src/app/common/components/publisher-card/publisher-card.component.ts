import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../services/configs.service';
import { UserAvatarService } from '../../services/user-avatar.service';

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

  readonly cdnUrl: string;
  btnIconOnly: boolean = false;
  size: 'small' | 'medium' | 'large' = 'large';

  constructor(
    protected userAvatar: UserAvatarService,
    protected session: Session,
    configs: ConfigsService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.onResize(), 0);
    }
  }

  @ViewChild('publisherCard') publisherCardEl: ElementRef;

  @HostListener('window:resize')
  onResize() {
    const publisherCardWidth = this.publisherCardEl.nativeElement.offsetWidth;

    if (publisherCardWidth <= 350) {
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
