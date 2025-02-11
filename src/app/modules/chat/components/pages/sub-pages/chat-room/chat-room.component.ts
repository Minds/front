import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomTopComponent } from '../../../chat-room/chat-room-topbar/chat-room-topbar.component';
import { SingleChatRoomService } from '../../../../services/single-chat-room.service';
import {
  ChatMessageEdge,
  ChatRoomEdge,
} from '../../../../../../../graphql/generated.engine';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { ChatwootWidgetService } from '../../../../../../common/components/chatwoot-widget/chatwoot-widget.service';
import { WINDOW } from '../../../../../../common/injection-tokens/common-injection-tokens';
import { ChatRoomMessagesComponent } from '../../../chat-room/chat-room-messages/chat-room-messages.component';
import { ChatMessagesService } from '../../../../services/chat-messages.service';
import { ChatRoomBottomBarComponent } from '../../../chat-room/chat-room-bottom-bar/chat-room-bottom-bar.component';
import { CommonModule } from '../../../../../../common/common.module';
import { ChatRoomRequestBottomBarComponent } from '../../../chat-room/chat-room-request-bottom-bar/chat-room-request-bottom-bar.component';
import { ChatRoomDetailsComponent } from '../../../chat-room/chat-room-details/chat-room-details.component';
import { ChatRoomMembersService } from '../../../../services/chat-room-members.service';
import { TotalChatRoomMembersService } from '../../../../services/total-chat-room-members.service';
import {
  AnimationTriggerMetadata,
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnalyticsService } from '../../../../../../services/analytics';

/** Bespoke animation to component to handle details drawer slide in. */
const SlideInFromRightAnimation: AnimationTriggerMetadata = trigger(
  'slideInFromRight',
  [
    transition(':enter', [
      style({ width: '250px', opacity: 0 }),
      animate('150ms linear', style({ width: '*', opacity: 1 })),
    ]),
    transition(
      ':leave',
      animate('150ms linear', style({ width: '250px', opacity: 0 }))
    ),
  ]
);

/**
 * Core sub-page for a chat-room.
 */
@Component({
  selector: 'm-chat__room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SingleChatRoomService,
    ChatMessagesService,
    ChatRoomMembersService,
    TotalChatRoomMembersService,
  ],
  imports: [
    NgCommonModule,
    CommonModule,
    ChatRoomTopComponent,
    ChatRoomMessagesComponent,
    ChatRoomBottomBarComponent,
    ChatRoomRequestBottomBarComponent,
    ChatRoomDetailsComponent,
  ],
  standalone: true,
  animations: [SlideInFromRightAnimation],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  /** Chat room from server. */
  protected readonly chatRoom$: Observable<ChatRoomEdge> =
    this.singleChatRoomService.chatRoom$;

  /** Messages for the chat room. */
  protected readonly chatMessages$: Observable<ChatMessageEdge[]> =
    this.chatMessagesService.edges$;

  /** Whether chat messages have been initialised. */
  protected chatMessagesInitialised$: Observable<boolean> =
    this.chatMessagesService.initialized$;

  /** GUID of the room.  */
  @Input()
  protected roomGuid: string;

  /** Whether the chat room is in request mode. */
  protected requestMode: boolean = false;

  /** Whether the details drawer is open. */
  protected detailsDrawerOpen: boolean = false;

  /** Subscription to chat room initialization. */
  private chatRoomInitSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private singleChatRoomService: SingleChatRoomService,
    private chatwootWidgetService: ChatwootWidgetService,
    private chatMessagesService: ChatMessagesService,
    private totalChatRoomMembersService: TotalChatRoomMembersService,
    private toaster: ToasterService,
    private analyticsService: AnalyticsService,
    @Inject(WINDOW) private window
  ) {}

  ngOnInit(): void {
    const roomId: string = this.route.snapshot.paramMap.get('roomId') ?? null;

    if (!roomId && !this.roomGuid) {
      this.toaster.warn('Chat room not found');
      this.router.navigateByUrl('/chat/rooms');
      return;
    }

    this.roomGuid = roomId || this.roomGuid;
    this.singleChatRoomService.init(this.roomGuid);
    this.totalChatRoomMembersService.setRoomGuid(this.roomGuid);
    this.chatMessagesService.init(this.roomGuid);

    this.requestMode = this.route.snapshot.data.requestMode ?? false;

    this.handleChatRoomInit(this.requestMode);
    this.hideChatwootWhenReady();
  }

  ngOnDestroy(): void {
    this.unsetGlobalAnalyticProperties();

    // reset chatwoot on destroy.
    this.window.removeEventListener(
      'chatwoot:ready',
      this.hideChatwootBubble.bind(this)
    );
    this.chatwootWidgetService.showBubble();
    this.chatRoomInitSubscription?.unsubscribe();
  }

  /**
   * Hides chatwoot when loaded (to avoid race condition).
   * Chatwoot will show OVER the send button of the message sender if this
   * is not run.
   * @returns { void }
   */
  private hideChatwootWhenReady(): void {
    if (this.window.$chatwoot?.hasLoaded) {
      this.hideChatwootBubble();
    } else {
      this.window.addEventListener(
        'chatwoot:ready',
        this.hideChatwootBubble.bind(this),
        false
      );
    }
  }

  /**
   * Hides the chatwoot bubble.
   * @returns { void }
   */
  private hideChatwootBubble(): void {
    this.chatwootWidgetService.hideBubble();
  }

  /**
   * Handles chat room init.
   * @param { boolean } requestMode - Whether the chat room is in request mode.
   * @returns { Promise<void> }
   */
  private async handleChatRoomInit(requestMode: boolean): Promise<void> {
    const chatRoom: ChatRoomEdge = await firstValueFrom(this.chatRoom$);

    if (chatRoom?.node?.isChatRequest && !requestMode) {
      this.router.navigate([`/chat/requests/${this.roomGuid}`], {
        relativeTo: this.route,
      });
    } else if (!chatRoom.node.isChatRequest && requestMode) {
      this.router.navigate([`/chat/rooms/${this.roomGuid}`], {
        relativeTo: this.route,
      });
    }

    this.setGlobalAnalyticProperties(chatRoom);
    this.analyticsService.trackView('chat_room_view');
  }

  /**
   * Handle details drawer open.
   * @returns { void }
   */
  protected showDetailsDrawer(): void {
    this.detailsDrawerOpen = true;
  }

  /**
   * Handle details drawer close.
   * @returns { void }
   */
  protected hideDetailsDrawer(): void {
    this.detailsDrawerOpen = false;
  }

  /**
   * Set global analytic properties.
   * @param { ChatRoomEdge } chatRoom - the chat room.
   * @returns { void }
   */
  private setGlobalAnalyticProperties(chatRoom: ChatRoomEdge): void {
    this.analyticsService.setGlobalProperty(
      'chat_room_guid',
      chatRoom.node.guid
    );
    this.analyticsService.setGlobalProperty(
      'chat_room_type',
      chatRoom.node.roomType
    );

    if (chatRoom?.lastMessageCreatedTimestamp) {
      this.analyticsService.setGlobalProperty(
        'chat_last_message_created_timestamp',
        new Date(chatRoom?.lastMessageCreatedTimestamp * 1000).toISOString()
      );
    }
  }

  /**
   * Unset global analytic properties.
   * @returns { void }
   */
  private unsetGlobalAnalyticProperties(): void {
    this.analyticsService.setGlobalProperty('chat_room_guid', undefined);
    this.analyticsService.setGlobalProperty('chat_room_type', undefined);
    this.analyticsService.setGlobalProperty(
      'chat_last_message_created_timestamp',
      undefined
    );
  }
}
