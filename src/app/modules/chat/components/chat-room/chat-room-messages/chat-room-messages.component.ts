import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import {
  ChatMessageEdge,
  PageInfo,
} from '../../../../../../graphql/generated.engine';
import { ChatMessagesService } from '../../../services/chat-messages.service';
import {
  Observable,
  debounceTime,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  take,
} from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ChatRoomMessageComponent } from './chat-room-message/chat-room-message.component';
import { ChatReceiptService } from '../../../services/chat-receipt.service';
import { Session } from '../../../../../services/session';

/** How far away from the top of the scroll area loading of new elements should start. */
const LOADING_BUFFER_TOP_PX: number = 300;

/**
 * Component holding messages for the chat room.
 */
@Component({
  selector: 'm-chatRoom__messages',
  styleUrls: ['./chat-room-messages.component.ng.scss'],
  templateUrl: './chat-room-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule, ChatRoomMessageComponent],
  standalone: true,
})
export class ChatRoomMessagesComponent extends AbstractSubscriberComponent
  implements OnInit, OnDestroy {
  /** Array of messages to be displayed. */
  @Input() protected messages: ChatMessageEdge[];

  /** Whether chat message loading is in progress. */
  protected readonly inProgress$: Observable<boolean> = this.chatMessagesService
    .inProgress$;

  /** Whether chat messages have a previous page. */
  protected readonly hasPreviousPage$: Observable<
    boolean
  > = this.chatMessagesService.pageInfo$.pipe(
    map((pageInfo: PageInfo) => pageInfo?.hasPreviousPage)
  );

  /** ID of the currently logged in user. */
  protected loggedInUserGuid: string = '';

  constructor(
    private chatMessagesService: ChatMessagesService,
    private chatReceiptService: ChatReceiptService,
    private session: Session,
    protected elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.loggedInUserGuid = this.session.getLoggedInUser()?.guid;

    // detach CD, reattach when initialized to prevent page jumps.
    this.cd.detach();

    this.subscriptions.push(
      this.chatMessagesService.chatMessageAppended$
        .pipe(filter(Boolean))
        .subscribe(message => {
          this.scrollToBottom();
        }),
      fromEvent(this.elementRef.nativeElement, 'scroll')
        .pipe(debounceTime(50))
        .subscribe((event: Event) => {
          if (this.elementRef.nativeElement.scrollTop < LOADING_BUFFER_TOP_PX) {
            this.fetchMore();
          }
        }),
      this.chatMessagesService.initialized$
        .pipe(take(1), filter(Boolean))
        .subscribe((_: boolean) => {
          // reattach change detector as we've loaded.
          this.cd.reattach();
          this.cd.detectChanges();

          // immediately scroll to bottom.
          this.scrollToBottom('instant');
        })
    );
  }

  /**
   * Scroll to the bottom of the page.
   * @param { 'instant' | 'smooth' } behavior - The behavior of the scroll.
   * @returns { void }
   */
  private scrollToBottom(behavior: 'instant' | 'smooth' = 'smooth'): void {
    this.elementRef.nativeElement.scrollTo({
      top: this.elementRef.nativeElement.scrollHeight,
      behavior: behavior,
    });

    this.updateReadReceipt();
  }

  /**
   * Updates the read read receipt to the last message in our list
   * TODO: (MH) make sure this only fire on new messages we have seen.
   * Currently this is firing BEFORE a new message is how in the list.
   */
  protected updateReadReceipt() {
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsg.node.sender.node.guid === this.session.getLoggedInUser().guid) {
      return; // Do not send for our own.
    }
    this.chatReceiptService.update(lastMsg.node.roomGuid, lastMsg.node.guid);
  }

  /**
   * Fetch more.
   * @returns { Promise<void> }
   */
  protected async fetchMore(): Promise<void> {
    const initialized: boolean = await firstValueFrom(
      this.chatMessagesService.initialized$
    );
    const inProgress: boolean = await firstValueFrom(
      this.chatMessagesService.inProgress$
    );
    const hasPreviousPage: boolean = await firstValueFrom(
      this.hasPreviousPage$
    );

    if (initialized && !inProgress && hasPreviousPage) {
      /**
       * Appending items to the top of this container causes the scroll position to
       * jump significantly, so we have to reset the scroll position to the correct place.
       * This causes a flash of the incorrect scroll position, so to prevent the layout jump,
       * we are detaching the change detector whilst loading, and reattaching it when loading
       * is completed, then scrolling back to correct place.
       */
      this.cd.detach();
      this.chatMessagesService.fetchMore();

      const initialScrollHeight: number = this.elementRef.nativeElement
        .scrollHeight;

      // await request inProgress state being false.
      await firstValueFrom(
        this.chatMessagesService.inProgress$.pipe(
          filter(inProgress => !inProgress)
        )
      );

      // push to back of event queue.
      setTimeout(() => {
        // reattach change detector.
        this.cd.reattach();
        this.cd.detectChanges();

        // scroll back to correct positon.
        this.elementRef.nativeElement.scrollTo({
          top: this.elementRef.nativeElement.scrollHeight - initialScrollHeight,
          behavior: 'instant',
        });
      }, 0);
    }
  }
}
