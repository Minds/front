import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';
import { ConfigsService } from '../../services/configs.service';
import { ChatIconService } from './chat-icon.service';

/**
 * Chat icon
 * Used in navigation to get to Minds Chat
 */
@Component({
  selector: 'm-chatIcon',
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.ng.scss'],
})
export class ChatIconComponent implements OnInit {
  readonly chatUrl: string;
  inProgress = false;
  unread$: Observable<number> = this.chatIconService.unread$;

  unread: number;
  unreadSubscripton: Subscription;

  @Input() floating: boolean = false;

  constructor(
    protected chatIconService: ChatIconService,
    protected session: Session,
    protected configs: ConfigsService
  ) {
    this.chatUrl = this.configs.get('matrix')?.chat_url;
  }

  ngOnInit(): void {
    if (this.session.getLoggedInUser()) {
      this.unreadSubscripton = this.unread$.subscribe(
        unread => (this.unread = unread)
      );
    }
  }

  ngOnDestroy() {
    if (this.unreadSubscripton) {
      this.unreadSubscripton.unsubscribe();
    }
  }

  @HostListener('window:focus', ['$event'])
  onWindowFocus(e: Event) {
    this.chatIconService.startPolling();
  }

  @HostListener('window:blur', ['$event'])
  onWindowBlur(e: Event) {
    this.chatIconService.stopPolling();
  }
}
