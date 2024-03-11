import { CommonModule as NgCommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { ChatMessageEdge } from '../../../../../../graphql/generated.engine';
import { Session } from '../../../../../services/session';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';
import { ChatMessagesService } from '../../../services/chat-messages.service';
import { Subscription, filter, take } from 'rxjs';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

/**
 * Component holding messages for the chat room.
 */
@Component({
  selector: 'm-chatRoom__messages',
  styleUrls: ['./chat-room-messages.component.ng.scss'],
  templateUrl: './chat-room-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule, ChatDatePipe],
  standalone: true,
})
export class ChatRoomMessagesComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /** Array of messages to be displayed. */
  @Input() protected messages: ChatMessageEdge[];

  /** Currently logged in users GUID. */
  protected readonly loggedInUserGuid: number;

  private messageAppendedSubscription: Subscription;
  private messagesInitializedSubscription: Subscription;

  constructor(
    private session: Session,
    private chatMessagesService: ChatMessagesService,
    private elementRef: ElementRef
  ) {
    this.loggedInUserGuid = this.session.getLoggedInUser()?.guid;
  }

  ngOnInit(): void {
    this.messageAppendedSubscription = this.chatMessagesService.chatMessageAppended$
      .pipe(filter(Boolean))
      .subscribe(message => {
        this.scrollToBottom();
      });
  }

  ngAfterViewInit(): void {
    this.messagesInitializedSubscription = this.chatMessagesService.initialized$
      .pipe(take(1), filter(Boolean))
      .subscribe(initialized => {
        this.scrollToBottom('instant');
      });
  }

  ngOnDestroy(): void {
    this.messageAppendedSubscription?.unsubscribe();
    this.messagesInitializedSubscription?.unsubscribe();
  }

  /**
   * TrackBy function for for-loop.
   * @param { ChatMessageEdge } message - The message.
   * @returns { string } - The guid of the message.
   */
  protected trackByFn(message: ChatMessageEdge): string {
    return message?.node?.guid;
  }

  private scrollToBottom(behavior: 'instant' | 'smooth' = 'smooth'): void {
    setTimeout(() => {
      this.elementRef.nativeElement.scrollTo({
        top: this.elementRef.nativeElement.scrollHeight,
        behavior: behavior,
      });
    }, 0);
  }
}
