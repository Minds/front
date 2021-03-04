import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../services/configs.service';
import { UserAvatarService } from '../../services/user-avatar.service';

@Component({
  selector: 'm-channelCard',
  templateUrl: './channel-card.component.html',
  styleUrls: ['./channel-card.component.ng.scss'],
})
export class ChannelCardComponent implements AfterViewInit {
  @Input() channel: any;

  @Input() showDescription: boolean = true;
  @Input() showSubs: boolean = true;
  @Input() showSubscribeButton: boolean = true;
  // @Input() showTags: boolean = false; // disabled

  // display a blue border
  @Input() featured: boolean = false;

  readonly cdnUrl: string;
  btnIconOnly: boolean = false;
  size: 'small' | 'medium' | 'large' = 'large';

  constructor(
    protected userAvatar: UserAvatarService,
    protected session: Session,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  @ViewChild('channelCard') channelCardEl: ElementRef;

  @HostListener('window:resize')
  onResize() {
    const channelCardWidth = this.channelCardEl.nativeElement.offsetWidth;

    if (channelCardWidth <= 350) {
      if (channelCardWidth > 250) {
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
    if (this.channel.guid === this.session.getLoggedInUser().guid) {
      return this.userAvatar.src$;
    }
    return of(
      `${this.cdnUrl}icon/${this.channel.guid}/medium/${this.channel.icontime}`
    );
  }
}
