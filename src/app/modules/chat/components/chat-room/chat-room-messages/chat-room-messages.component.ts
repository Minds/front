import { CommonModule as NgCommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { Session } from '../../../../../services/session';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';
import { ChatMessagesService } from '../../../services/chat-messages.service';
import {
  Observable,
  combineLatest,
  debounceTime,
  filter,
  fromEvent,
  map,
  take,
} from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';

/** How far away from the top of the scroll area loading of new elements should start. */
const LOADING_BUFFER_TOP_PX: number = 500;

/**
 * Component holding messages for the chat room.
 */
@Component({
  selector: 'm-chatRoom__messages',
  styleUrls: ['./chat-room-messages.component.ng.scss'],
  templateUrl: './chat-room-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule, ChatDatePipe, ScrollingModule],
  standalone: true,
})
export class ChatRoomMessagesComponent extends AbstractSubscriberComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /** Array of messages to be displayed. */
  @Input() protected messages: ChatMessageEdge[];

  /** Currently logged in users GUID. */
  protected readonly loggedInUserGuid: number;

  /** Whether chat message loading is in progress. */
  protected readonly inProgress$: Observable<boolean> = this.chatMessagesService
    .inProgress$;

  /** Whether chat messages have a previous page. */
  protected readonly hasPreviousPage$: Observable<
    boolean
  > = this.chatMessagesService.pageInfo$.pipe(
    map((pageInfo: PageInfo) => pageInfo?.hasPreviousPage)
  );

  constructor(
    private session: Session,
    private chatMessagesService: ChatMessagesService,
    protected elementRef: ElementRef
  ) {
    super();
    this.loggedInUserGuid = this.session.getLoggedInUser()?.guid;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.chatMessagesService.chatMessageAppended$
        .pipe(filter(Boolean))
        .subscribe(message => {
          this.scrollToBottom();
        }),

      fromEvent(this.elementRef.nativeElement, 'scroll')
        .pipe(debounceTime(1))
        .subscribe((event: any) => {
          console.log(typeof event);
          console.log(event);
          console.log(this.elementRef.nativeElement.scrollTop);
          if (this.elementRef.nativeElement.scrollTop < LOADING_BUFFER_TOP_PX) {
            this.fetchMore();
          }
        })
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.chatMessagesService.initialized$
        .pipe(take(1), filter(Boolean))
        .subscribe(initialized => {
          this.scrollToBottom('instant');
        })
    );
  }

  /**
   * TrackBy function for for-loop.
   * @param { ChatMessageEdge } message - The message.
   * @returns { string } - The guid of the message.
   */
  protected trackByFn(message: ChatMessageEdge): string {
    return message?.node?.guid;
  }

  /**
   * Scroll to the bottom of the page.
   * @param { 'instant' | 'smooth' } behavior - The behavior of the scroll.
   * @returns { void }
   */
  private scrollToBottom(behavior: 'instant' | 'smooth' = 'smooth'): void {
    setTimeout(() => {
      this.elementRef.nativeElement.scrollTo({
        top: this.elementRef.nativeElement.scrollHeight,
        behavior: behavior,
      });
    }, 0);
  }

  /**
   * Fetch more.
   * @returns { Promise<void> }
   */
  protected async fetchMore(): Promise<void> {
    this.subscriptions.push(
      combineLatest([
        this.chatMessagesService.initialized$,
        this.chatMessagesService.inProgress$,
        this.hasPreviousPage$,
      ])
        .pipe(take(1))
        .subscribe(
          ([initialized, inProgress, hasPreviousPage]: [
            boolean,
            boolean,
            boolean
          ]): void => {
            const initialScrollHeight: number = this.elementRef.nativeElement
              .scrollHeight;

            if (initialized && !inProgress && hasPreviousPage) {
              this.chatMessagesService.fetchMore();

              // await in progress being true.
              this.subscriptions.push(
                this.chatMessagesService.inProgress$
                  .pipe(
                    filter(inProgress => !inProgress),
                    take(1)
                  )
                  .subscribe((inProgress: boolean) => {
                    // push to back of event queue, to give change detector time to run.
                    setTimeout(() => {
                      this.elementRef.nativeElement.scrollTo({
                        top:
                          this.elementRef.nativeElement.scrollHeight -
                          initialScrollHeight,
                        behavior: 'instant',
                      });
                    }, 0);
                  })
              );
            }
          }
        )
    );
  }
}
