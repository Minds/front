import { Injectable, OnDestroy } from '@angular/core';
import { firstValueFrom, Subject, Subscription, throttleTime } from 'rxjs';
import {
  ChatRoomEvent,
  ChatRoomEventType,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { Session } from '../../../services/session';
import { NotificationToasterV2Service } from '../../../common/components/notification-toaster-v2/notification-toaster-v2.service';
import { Router } from '@angular/router';
import {
  ChatRoomNotificationStatusEnum,
  GetChatRoomNotificationStatusGQL,
  GetChatRoomNotificationStatusQuery,
} from '../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';

/** Throttle time that prevents spam when new messages are sent. */
const NEW_MESSAGE_THROTTLE_TIME: number = 5000;

/**
 * Service to handle toast notifications of chat messages.
 */
@Injectable({ providedIn: 'root' })
export class ChatNotificationToasterService implements OnDestroy {
  /** Subscription to socket events. */
  private socketEventSubscription: Subscription;

  /** Subscription to logged in status. */
  private loggedInSubcription: Subscription;

  /** Subscriptions to room events. */
  private roomSubscriptions: Subscription[] = [];

  /** Subjects for room events. */
  private roomSubjects: { [key: string]: Subject<ChatRoomEvent> } = {};

  constructor(
    private globalChatSocketService: GlobalChatSocketService,
    private notificationToaster: NotificationToasterV2Service,
    private getChatRoomNotificationStatusGql: GetChatRoomNotificationStatusGQL,
    private session: Session,
    private router: Router
  ) {}

  /**
   * Initializes the chat notification toaster service.
   * @returns { void }
   */
  public init(): void {
    if (
      this.socketEventSubscription ||
      this.roomSubscriptions.length ||
      Object.keys(this.roomSubjects)?.length
    ) {
      this.destroyRoomSubscriptions();
    }

    this.initSocketSubscription();

    this.loggedInSubcription = this.session.loggedinEmitter.subscribe(
      (loggedIn: boolean): void => {
        if (loggedIn) {
          this.initSocketSubscription();
        } else {
          this.destroyRoomSubscriptions();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyRoomSubscriptions();
    this.loggedInSubcription?.unsubscribe();
  }

  /**
   * Destroys all room subscriptions, subjects and stops listening to socket evens.
   * @returns { void }
   */
  private destroyRoomSubscriptions(): void {
    this.socketEventSubscription?.unsubscribe();

    this.roomSubscriptions.forEach((subscription: Subscription) => {
      subscription?.unsubscribe();
    });

    this.roomSubjects = {};
  }

  /**
   * Initializes the socket subscription to listen for new messages.
   * @returns { void }
   */
  private initSocketSubscription(): void {
    this.socketEventSubscription =
      this.globalChatSocketService.globalEvents$.subscribe(
        async (event: ChatRoomEvent): Promise<void> => {
          if (
            !event?.data ||
            event.data['type'] !== ChatRoomEventType.NewMessage
          ) {
            return;
          }

          const senderGuid: number = event.data?.['metadata']?.['senderGuid'];
          const loggedInUserGuid: number = Number(
            this.session.getLoggedInUser()?.guid
          );

          if (!loggedInUserGuid) {
            return;
          }

          if (senderGuid != loggedInUserGuid && !this.isOnChatPage()) {
            const roomGuid: string = (event?.data as any)?.metadata?.roomGuid;

            if (await this.isChatRoomMuted(roomGuid)) {
              return;
            }

            const key: string = this.buildNotificationKey(roomGuid);

            // If there is no room subject already...
            if (!this.roomSubjects[key]) {
              // Create a new subject for the room.
              this.roomSubjects[key] = new Subject<ChatRoomEvent>();

              // Subscribe to it, to trigger a notification toast with given throttling applied.
              this.roomSubscriptions.push(
                this.roomSubjects[key]
                  .pipe(throttleTime(NEW_MESSAGE_THROTTLE_TIME))
                  .subscribe((event: ChatRoomEvent): void => {
                    this.showNotificationToast(event);
                  })
              );
            }

            // Emit to the room subject.
            this.roomSubjects[key].next(event);
          }
        }
      );
  }

  /**
   * Shows a notification toast for a chat message.
   * @param { ChatRoomEvent } event - the chat room event.
   * @returns { Promise<void> }
   */
  private async showNotificationToast(event: ChatRoomEvent): Promise<void> {
    const data: any = event?.data;

    if (
      !this.session.isLoggedIn() ||
      this.isOnChatPage() ||
      !data?.metadata?.roomGuid ||
      (await this.isChatRoomMuted(data.metadata.roomGuid))
    ) {
      return;
    }

    const roomPath: string = '/chat/rooms/' + data.metadata.roomGuid;
    const text: string = data.metadata?.senderName
      ? `New chat message from @${data.metadata.senderName}.`
      : 'You received a new chat message.';
    const key: string = this.buildNotificationKey(data.metadata?.roomGuid);

    this.notificationToaster.clearByKey(key);
    this.notificationToaster.info({
      key: key,
      text: text,
      href: roomPath,
      avatarObject: {
        guid: data.metadata?.senderGuid,
        type: 'user',
      },
    });
  }

  /**
   * Checks if the user is on the chat page.
   * @returns { boolean } - whether the user is on the chat page.
   */
  private isOnChatPage(): boolean {
    return this.router.url.startsWith('/chat');
  }

  /**
   * Builds a notification key for a chat room.
   * @param { string } roomGuid - the room guid.
   * @returns { string } - the notification key.
   */
  private buildNotificationKey(roomGuid: string): string {
    return `chat-message:${roomGuid}`;
  }

  /**
   * Checks if a chat room is muted.
   * @param { string } roomGuid - the room guid.
   * @returns { Promise<boolean> } - whether the chat room is muted.
   */
  private async isChatRoomMuted(roomGuid: string): Promise<boolean> {
    return (
      (await this.getChatRoomNotificationStatus(roomGuid)) ===
      ChatRoomNotificationStatusEnum.Muted
    );
  }

  /**
   * Gets the notification status of a chat room.
   * @param { string } roomGuid - the room guid.
   * @returns { Promise<ChatRoomNotificationStatusEnum> } - the notification status.
   */
  private async getChatRoomNotificationStatus(
    roomGuid: string
  ): Promise<ChatRoomNotificationStatusEnum> {
    const response: ApolloQueryResult<GetChatRoomNotificationStatusQuery> =
      await firstValueFrom(
        this.getChatRoomNotificationStatusGql.fetch(
          { roomGuid },
          {
            fetchPolicy: 'cache-first',
          }
        )
      );
    return response?.data?.chatRoom?.node?.chatRoomNotificationStatus;
  }
}
